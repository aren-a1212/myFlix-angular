import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService,  } from '../fetch-api-data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
/**
 * User registration form component
 */


@Component({
  selector: 'app-user-registration-form',
  standalone: false,
  templateUrl: './user-registration-form.html',
  styleUrls: ['./user-registration-form.scss']
})
export class UserRegistrationForm implements OnInit {
 /** User data input for registration */
@Input() userData= {username: '', password: '', email: '', firstName: '',
  lastName: '', birthday:''};

 /**
   * @param FetchApiData - API service
   * @param dialogRef - Dialog reference
   * @param snackBar - Notification service
   */


constructor(
private fetchApiData: FetchApiDataService,
  private router: Router,
  public dialogRef: MatDialogRef<UserRegistrationForm>,
  public snackBar: MatSnackBar) {}
  ngOnInit(): void{

  }

 /** Registers user and handles response */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (response: any) => {
        console.log('Registration response:', response);

    const user = response.user || response;
        // Optionally immediately log them in:
        this.fetchApiData.userLogin(this.userData).subscribe(loginRes => {
          localStorage.setItem('token', loginRes.token);
          localStorage.setItem('user', JSON.stringify(loginRes.user));
          this.dialogRef.close();
          this.snackBar.open('Registration & login successful!', 'OK', { duration: 2000 });
          this.router.navigate(['movies']);
        });

    },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Registration failed: ' + err, 'OK', { duration: 2000 });
      }
    });
  }
}