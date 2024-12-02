import { Component } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  user = '';
  studentId = '';
  pass = '';
  confirmPass = '';
  errors: any = {};
  responseMessage = '';

  loggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if a token exists
  }

  validateForm() {
    const errors: any = {};

    if (!this.user.trim()) {
      errors.user = 'Username is required';
    }
    if (!this.studentId.trim()) {
      errors.studentId = 'Student ID is required';
    }
    if (!this.pass.trim()) {
      errors.pass = 'Password is required';
    }
    if (this.pass !== this.confirmPass) {
      errors.confirmPass = 'Passwords do not match';
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    if (this.validateForm()) {
      try {
        const serverResponse = await axios.post('http://143.198.111.165:3000/api/signup', {
          username : this.user,
          studentid: this.studentId,
          password : this.pass,
        });

        console.log('Form submitted successfully!', serverResponse.data);
        this.responseMessage = 'Registration successful!';
        this.user = '';
        this.pass = '';
        this.confirmPass = '';
        this.studentId = '';
      } catch (error: any) {
        if (error.response && error.response.data.error.includes('Duplicate Entry')) {
          this.responseMessage = 'Registration failed. Please check the form.';
          this.errors.server = error.response.data.error || 'Server error';
        } else {
          this.responseMessage = 'Registration failed. Please check the form.';
          this.errors.server = error.response.data.error || 'Server error';
        }
      }
    } else {
      console.log('Form validation failed');
      this.responseMessage = 'Please correct the errors and try again.';
    }
  }
}
