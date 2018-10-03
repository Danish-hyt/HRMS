import { Component, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT } from '@angular/common';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    @Inject(DOCUMENT) private document: any,  private cookieService: CookieService) {
      // if (!this.cookieService.check('sesid')) {
      //   this.document.location.href = environment.redirectURL;
      // }
    }
}
