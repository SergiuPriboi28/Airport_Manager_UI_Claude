import { Component } from '@angular/core';

@Component({
  selector: 'app-environment.development',
  imports: [],
  templateUrl: './environment.development.html',
  styleUrl: './environment.development.css',
})
export const environment = {
  apiBaseUrl: 'http://localhost:8080/api',
  googleClientId: '769699408996-u4d32n7ac7d781h5uoi4gp0lr2g35pmj.apps.googleusercontent.com',
};
