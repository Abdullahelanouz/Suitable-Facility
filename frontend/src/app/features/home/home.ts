import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    // Run after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.checkReveals();
    }, 100);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.checkReveals();
    this.updateScrollProgress();
  }

  private checkReveals() {
    if (typeof window === 'undefined') return;
    
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = reveals[i].getBoundingClientRect().top;
        let elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
  }

  private updateScrollProgress() {
    if (typeof window === 'undefined') return;
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    const progressEl = document.getElementById('scrollProgress');
    if (progressEl) {
        progressEl.style.width = scrolled + '%';
    }
  }
}
