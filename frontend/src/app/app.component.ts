import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { HostListener } from '@angular/core';
import { RouterLink , RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet ,SlickCarouselModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shop-web';
  showButton = false;
  @HostListener('window:scroll', [])
onWindowScroll() {
  this.showButton = window.scrollY > 250;
}

scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

}



