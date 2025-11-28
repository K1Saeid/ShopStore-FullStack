import { Component } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [SlickCarouselModule, CommonModule ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {

  images = [
    "assets/imagesSlider/20251101-desktop-slider-BE-Black-Friday-2025-03.jpg",
    "assets/imagesSlider/20251105-desktop-slider-adidas-Belgie-Home-1.jpg",
    "assets/imagesSlider/20651101-desktop-slider-NL-Black-Friday-2025-06.jpg"
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    dots: true,
    arrows: true,
    infinite: true,
    
  };
}
