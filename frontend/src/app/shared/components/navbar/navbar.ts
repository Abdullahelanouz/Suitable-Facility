import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  isLangMenuOpen = false;
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }


  constructor(
    public translate: TranslateService,
    public authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleTranslate();
      this.observeLanguageChange();
    }
  }


  logout() {
    this.authService.logout();
  }

  goToDashboard(user: any) {
    alert('Going to dashboard for: ' + user.role);
    if (!user) return;


    if (user.role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (user.role === 'Technician') {
      this.router.navigate(['/portugal/dashboard/tech']);
    } else {
      this.router.navigate(['/portugal/dashboard/client']);
    }
    this.closeMenu();
  }





  observeLanguageChange() {
    const htmlTag = document.getElementsByTagName('html')[0];
    if (!htmlTag) return;
    
    // Observer to detect when Google Translate adds the translated-rtl class
    const observer = new MutationObserver(() => {
      if (htmlTag.classList.contains('translated-rtl') || document.body.classList.contains('translated-rtl')) {
        htmlTag.setAttribute('dir', 'rtl');
      } else if (htmlTag.classList.contains('translated-ltr') || document.body.classList.contains('translated-ltr')) {
        htmlTag.setAttribute('dir', 'ltr');
      } else {
        htmlTag.setAttribute('dir', 'ltr');
      }
    });

    observer.observe(htmlTag, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  loadGoogleTranslate() {
    // Check if script is already added
    if (document.getElementById('google-translate-script')) return;

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ar,en,pt',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
  }

  toggleLangMenu() {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      const htmlTag = document.getElementsByTagName('html')[0];
      htmlTag.setAttribute('lang', lang);
      htmlTag.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }
    this.isLangMenuOpen = false;
  }
}
