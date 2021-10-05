import { Component } from '@angular/core';
import { NavbarService } from './Services/navbar.service';
import { Router } from '@angular/router';
import { EmailService } from './Services/email.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';

  constructor( public nav: NavbarService,
    private router:Router,
    private service : EmailService ) {}

  ngOnInit(): void {
    this.nav.show();
  }
  Logout () {
    this.service.deleteAll();
    this.router.navigate(['']);;
};
}
