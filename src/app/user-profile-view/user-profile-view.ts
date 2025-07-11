import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DirectorDialog } from '../director-dialog/director-dialog';
import { MovieDetailsDialog } from '../movie-details-dialog/movie-details-dialog';
import { GenreDialog } from '../genre-dialog/genre-dialog';




/**
 * User profile view component
 */

@Component({
  selector: 'app-user-profile-view',
  standalone: false,
  templateUrl: './user-profile-view.html',
  styleUrls: ['./user-profile-view.scss']
})
export class UserProfileView implements OnInit   {
    /** User profile data */
@Input() user: any = {};

@Input() birthday :string= '';

@Input() firstName: string = '';

@Input() lastName: string = '';

favoriteMovies : any[] = [];





constructor(
  public fetchApiData: FetchApiDataService,
public snackBar : MatSnackBar,
public dialog: MatDialog,
public router: Router
) {}

ngOnInit(): void {
    this.getUserData();
}

 /** Gets formatted birthday */
get displaybirthday() {
  return this.birthday;
}
  /** Sets birthday value */
set displaybirthday(v) {
this.user.birthday = v; 
}

  /** Fetches user data from API */
getUserData(): void {
  const localUser : string| null= localStorage.getItem('user');

  if (!localUser){
    this.router.navigate(['/welcome']);
    return;
  }
 const parsedUser: any = JSON.parse(localUser);
    this.fetchApiData.getUser().subscribe((result) => {
       console.log('👤 fetched user:', result);
      this.user = result;
      delete this.user.password;
      this.birthday = new Date(this.user.birthday).toLocaleDateString();
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavoriteMovies();
    });
  }
   /** Updates user profile */
updateUser(): void {
  console.log('Updating user:', this.user);
  this.fetchApiData.editUser(this.user).subscribe(
    (result) => {
      // Update local component state directly
      this.user = { ...result };
      delete this.user.password;
      this.birthday = new Date(this.user.birthday).toLocaleDateString();
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(this.user));
      
      this.snackBar.open('Update successful', 'OK', {
        duration: 2000,
      });
    },
    (error) => {
      this.snackBar.open('Update failed: ' + error, 'OK', {
        duration: 2000,
      });
    }
  );
}
        /** Gets user's favorite movies */
  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      const allMovies: any[] = resp;
      this.favoriteMovies = allMovies.filter((movie) =>
        this.user.favoriteMovies.includes(movie._id)
      );
      return this.favoriteMovies;
    });
  }
     /** Removes movie from favorites */
  removeFavorite(movieId: string): void {

   this.fetchApiData.deleteFavoriteMovie(movieId).subscribe({
    next: (updatedUser) => {
      this.snackBar.open('Movie removed from favorites', 'OK', { duration: 2000 });
      // Update your local user and re-filter the favorites list
      this.user = updatedUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.getFavoriteMovies();  
    },
    error: (err) => {
      this.snackBar.open('Could not remove movie from favorites', 'OK', { duration: 2000 });
    }
  });
}
  

      
   /** Opens director details dialog */
openDirectorDialog(director: any): void {
   const moviesByDirector = this.favoriteMovies.filter(
      (m: any) => m.director.name === director.name
    );
  this.dialog.open(DirectorDialog, {
    width: '400px',
    data:{
      director,
      movies :moviesByDirector
    }
  });
}

  /** Opens genre details dialog */
openGenreDialog(genre: any): void {
  this.dialog.open(GenreDialog, {
    width: '400px',
    data: genre
  });
}

  /** Opens movie details dialog */
openMovieDetailsDialog(movie: any): void {
  this.dialog.open(MovieDetailsDialog, {
    width: '400px',
    data: movie
  });
}
}