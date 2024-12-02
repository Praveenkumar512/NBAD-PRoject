import { Component } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginUser = '';
  loginPass = '';
  loginErrors: any = {};
  responseMessage = '';

  constructor(private router: Router) {}

  validateLoginForm() {
    const errors: any = {};

    if (!this.loginUser.trim()) {
      errors.username = 'Username is required';
    }
    if (!this.loginPass.trim()) {
      errors.password = 'Password is required';
    }

    this.loginErrors = errors;
    return Object.keys(errors).length === 0;
  }

  async handleLogin(event: Event) {
    event.preventDefault();
    if (this.validateLoginForm()) {
      try {
        const response = await axios.post('http://143.198.111.165:3000/api/login', {
          username: this.loginUser,
          password: this.loginPass
        });

        console.log('Login successful!', response.data);
        localStorage.setItem('token', response.data.token); // Save the token in localStorage
        this.responseMessage = 'Login successful!';
        this.router.navigate(['/dashboard']);

      } catch (error: any) {
        this.responseMessage = 'Login failed. Please check your credentials.';
        this.loginErrors.server = error.response?.data.error || 'Server error';
      }
    } else {
      this.responseMessage = 'Please fill in all required fields.';
    }
  }
}
