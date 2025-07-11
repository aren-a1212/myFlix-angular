import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of} from 'rxjs';
import { map, catchError } from 'rxjs';
import { FetchApiDataService } from '../fetch-api-data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsDialog } from '../movie-details-dialog/movie-details-dialog';
import { GenreDialog } from '../genre-dialog/genre-dialog';
import { DirectorDialog } from '../director-dialog/director-dialog';

/**
 * Movie card component for displaying and managing movies
 */


@Component({
  selector: 'app-movie-card',
  standalone: false,
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.scss']
})
export class MovieCard implements OnInit{
  movies:any[]=[];
  private omdbKey = 'c1ed012d';
  constructor(public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private http:         HttpClient,
    
  ){}
  
  ngOnInit():void{
    this.getMovies();
  }
    /** Fetches movies with posters from APIs */
   getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((baseList: any[]) => {
    // build one poster-fetch observable per movie
    const withPoster$ = baseList.map(movie =>
      this.http
        .get<any>(
          `https://www.omdbapi.com/?t=${encodeURIComponent(
            movie.title
          )}&apikey=${this.omdbKey}`
        )
        .pipe(
          map(data =>
            data.Poster && data.Poster !== 'N/A'
              ? data.Poster
              : 'https://via.placeholder.com/300x450?text=No+Image'
          ),
          catchError(() =>
            of('https://via.placeholder.com/300x450?text=No+Image')
          ),
          // attach the poster URL onto the movie object
          map(posterUrl => ({ ...movie, posterImage: posterUrl }))
        )
    );

    // wait for *all* of them to finish
    forkJoin(withPoster$).subscribe(fullList => {
      this.movies = fullList;
      console.log('Movies with posters:', this.movies);
    });
  });
}
   /** Checks if movie is favorite */
  

    /** Toggles movie favorite status */
  handleFavorite(movieId: string): void {
    const localUser: string | null = localStorage.getItem('user');
    const parsedUser: any = localUser && JSON.parse(localUser);

    const localFavorites: string[] = [...parsedUser.favoriteMovies];
    if (!localFavorites.includes(movieId)) {
      localFavorites.push(movieId);
    } else {
      const removeFavorite: number = localFavorites.findIndex((m) => m === movieId);
      localFavorites.splice(removeFavorite, 1);
    }

    const favoriteMovies: any = {
      FavoriteMovies: localFavorites,
    };

    parsedUser.FavoriteMovies = localFavorites;

    this.fetchApiData.editUser( favoriteMovies).subscribe(
      (result) => {
        this.snackBar.open(
          parsedUser.FavoriteMovies.includes(movieId)
            ? 'Movie added to favorites'
            : 'Movie removed from favorites',
          'OK',
          {
            duration: 2000,
          }
        );
        localStorage.setItem('user', JSON.stringify(parsedUser));
      },
      (result) => {
        this.snackBar.open('Could update favorites' + result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
addFavorite(movieId: string): void {
    // Find the movie in the local array
    const movieIndex = this.movies.findIndex(m => m._id === movieId);
    if (movieIndex === -1) return;

    // Show optimistic UI update
    this.movies[movieIndex].isFavorite = true;

    this.fetchApiData.addFavoriteMovie(movieId).subscribe({
      next: () => {
        this.snackBar.open('Added to favorites!', 'OK', { duration: 2000 });
        
        // Update local storage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.favoriteMovies.includes(movieId)) {
          user.favoriteMovies.push(movieId);
          localStorage.setItem('user', JSON.stringify(user));
        }
      },
      error: () => {
        // Revert UI on error
        this.movies[movieIndex].isFavorite = false;
        this.snackBar.open('Could not add to favorites', 'OK', { duration: 2000 });
      }
    });
  }

   /** Checks if movie is favorite */
  isFavorite(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.favoriteMovies?.includes(movieId) || false;
  }



    /** Opens director info dialog */
  openDirectorDialog(director: any): void {
     const moviesByDirector = this.movies.filter(
    m => m.director.name === director.name
  );
    this.dialog.open(DirectorDialog, {
      width: '400px',
      data:{
       director,
      movies: moviesByDirector
      }
    });
  }
  /** Opens genre info dialog */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialog, {
      width: '400px',
      data: genre,
    });
  }

    /** Opens movie details dialog */
  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialog, {
      width: '400px',
      data: movie,
    });
  }
}
  


