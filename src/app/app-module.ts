import { input, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule }   from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule }    from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { UserRegistrationForm } from './user-registration-form/user-registration-form';
import { UserLoginForm } from './user-login-form/user-login-form';
import { MovieCard } from './movie-card/movie-card';
import { WelcomePage } from './welcome-page/welcome-page';
import {MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserProfileView } from './user-profile-view/user-profile-view';
import { MovieDetailsDialog } from './movie-details-dialog/movie-details-dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DirectorDialog } from './director-dialog/director-dialog';
import { GenreDialog } from './genre-dialog/genre-dialog';

const appRoutes:Routes=[
  {path:'welcome' ,   component:WelcomePage},
  {path:'movies'  ,   component:MovieCard } ,
  { path: 'profile', component: UserProfileView },
  {path:'', redirectTo:'welcome', pathMatch:'prefix'},
];

@NgModule({
  declarations: [
    UserRegistrationForm,
    App,
        UserLoginForm,
        MovieCard,
        WelcomePage,
        UserProfileView,
        MovieDetailsDialog,
        DirectorDialog,
        GenreDialog
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
