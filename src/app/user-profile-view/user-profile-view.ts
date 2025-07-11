import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DirectorDialog } from '../director-dialog/director-dialog';
import { MovieDetailsDialog } from '../movie-details-dialog/movie-details-dialog';
import { GenreDialog } from '../genre-dialog/genre-dialog';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs';
@Component({
  standalone: false,
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.html',
  styleUrls: ['./user-profile-view.scss']
})
export class UserProfileView implements OnInit {
  user: any = {};
  birthday: Date | null = null;
  password = '';
  confirmPassword = '';
  showPasswordFields = false;
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    const localUser = localStorage.getItem('user');
    if (!localUser) {
      this.router.navigate(['/welcome']);
      return;
    }
    
    const parsedUser = JSON.parse(localUser);
    this.fetchApiData.getUser().subscribe((result) => {
      this.user = {...result, password: ''};
     if (this.user.birthday) {
      // Handle both ISO strings and YYYY-MM-DD formats
      const dateStr = this.user.birthday.includes('T') 
        ? this.user.birthday.split('T')[0] 
        : this.user.birthday;
      
      const [year, month, day] = dateStr.split('-').map(Number);
      this.birthday = new Date(year, month - 1, day);
    } else {
      this.birthday = null;
    }
      localStorage.setItem('user', JSON.stringify(this.user));
      this.getFavoriteMovies();
    });
  }

  updateUser(): void {

    const birthdayStr = this.birthday 
    ? `${this.birthday.getFullYear()}-${(this.birthday.getMonth() + 1).toString().padStart(2, '0')}-${this.birthday.getDate().toString().padStart(2, '0')}`
    : null;

    const updateData: any = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      username: this.user.username,
      email: this.user.email,
      Birthday: birthdayStr
    };

   if (this.password && this.password === this.confirmPassword) {
      updateData.password = this.password;
    } else if (this.password) {
      this.snackBar.open('Passwords do not match', 'OK', { duration: 2000 });
      return;
    }

    this.fetchApiData.editUser(updateData).subscribe(
      (result) => {
        this.user = {...result, password: ''};
        if (result.birthday) {
          const dateParts = result.birthday.split('-');
          this.birthday = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          );
        } else {
          this.birthday = null;
        }
        this.password = '';
        this.confirmPassword = '';
        this.showPasswordFields = false;
        
        localStorage.setItem('user', JSON.stringify(result));
        this.snackBar.open('Update successful', 'OK', { duration: 2000 });
      },
      (error) => {
        this.snackBar.open('Update failed: ' + error, 'OK', { duration: 2000 });
      }
    );
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      const allMovies: any[] = resp;
      const favoriteMovies = allMovies.filter((movie) =>
        this.user.favoriteMovies.includes(movie._id)
      );
      
      // Fixed: Use favoriteMovies instead of this.favoriteMovies
      const posterRequests = favoriteMovies.map(movie => 
        this.fetchApiData.getMoviePoster(movie.title).pipe(
          map(posterUrl => ({ ...movie, posterImage: posterUrl }))
      ));
      
      if (posterRequests.length > 0) {
        forkJoin(posterRequests).subscribe(moviesWithPosters => {
          this.favoriteMovies = moviesWithPosters;
        });
      } else {
        this.favoriteMovies = favoriteMovies;
      }
    });
  }

  removeFavorite(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
        this.snackBar.open('Movie removed from favorites', 'OK', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Could not remove movie', 'OK', { duration: 2000 });
      }
    });
  }

  openDirectorDialog(director: any): void {
    const moviesByDirector = this.favoriteMovies.filter(
      (m: any) => m.director.name === director.name
    );
    this.dialog.open(DirectorDialog, {
      width: '400px',
      data: {
        director,
        movies: moviesByDirector
      }
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialog, {
      width: '400px',
      data: genre
    });
  }

  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialog, {
      width: '400px',
      data: movie
    });
  }
}