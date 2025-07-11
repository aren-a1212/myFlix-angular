import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

import { UserLoginForm } from './user-login-form/user-login-form';

/** Movie API base URL */
const apiUrl="https://movies-fix-b2e97731bf8c.herokuapp.com/"
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  //** Handles API requests for movie data and user management */

 constructor(private http: HttpClient) { }

    /** Extracts response body */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {}
  }

   /** 
   * User login 
   * @param userDetails - {username, password}
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }



 /** 
   * User login 
   * @param userDetails - {username, password}
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }
 /** Handles HTTP errors */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  /** Gets all movies */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /** 
   * Gets single movie 
   * @param movieId - Movie ID
   */
  public getMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `movies/${movieId}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

   /** 
   * Gets director details 
   * @param directorName - Director's name
   */
  public getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `directors/${directorName}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /** 
   * Gets genre details 
   * @param genreName - Genre name
   */
  public getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `genres/${genreName}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

    /** Gets current user data */
  public getUser(): Observable<any> {
    const token = localStorage.getItem('token');
   const stored = JSON.parse(localStorage.getItem('user') || '{}');
    const username = stored.username;
    return this.http.get(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /** 
   * Adds movie to favorites 
   * @param movieId - Movie ID to add
   */
  public addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const username   = storedUser.username;     
    return this.http.post(apiUrl + `users/${username}/${movieId}`, null, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

   /** 
   * Updates user profile 
   * @param userDetails - New user data
   */
  public editUser(userDetails: any): Observable<any> {
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const oldUsername = storedUser.username; // Store old username before update

  return this.http.put(apiUrl + `users/${oldUsername}`, userDetails, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token,
    })
  }).pipe(
    map((response: any) => {
      // Update local storage with new username
      if (userDetails.username) {
        storedUser.username = userDetails.username;
        localStorage.setItem('user', JSON.stringify(storedUser));
        localStorage.setItem('username', userDetails.username);
      }
      return response;
    }),
    catchError(this.handleError)
  );
}

    /** Deletes user account */
  public deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return this.http.delete(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
private omdbKey = 'c1ed012d'; // Your OMDB API key

public getMoviePoster(title: string): Observable<string> {
  const omdbKey = 'c1ed012d'; // Your OMDB API key
  return this.http.get<any>(
    `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${omdbKey}`
  ).pipe(
    map(data => 
      data.Poster && data.Poster !== 'N/A' 
        ? data.Poster 
        : 'https://via.placeholder.com/300x450?text=No+Image'
    ),
    catchError(() => 
      ('https://via.placeholder.com/300x450?text=No+Image')
    )
  );
}
/** 
   * Removes movie from favorites 
   * @param movieId - Movie ID to remove
   */
  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const username   = storedUser.username;
    return this.http.delete(apiUrl + `users/${username}/${movieId}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
}