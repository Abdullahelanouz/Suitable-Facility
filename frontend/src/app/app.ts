import { Component, Inject, PLATFORM_ID, OnInit, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { FooterComponent } from './shared/components/footer/footer';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { SeoService } from './core/services/seo.service';

interface RouteData {
  title: string;
  description: string;
  keywords?: string;
  schema?: any;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  showLayout = true;
  showScrollTop = false;
  
  private seoMap: Record<string, RouteData> = {
    '/': {
      title: 'Suitable Facility | Leading MEP & Facility Engineering',
      description: 'Global integrated facility management and MEP engineering services. Certified technicians for HVAC, electrical, plumbing and civil works in Portugal and UAE.',
      keywords: 'MEP engineering, facility management, HVAC maintenance, electrical services, plumbing, Portugal technicians, UAE engineering',
      schema: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Suitable Facility",
        "url": "https://suitablefacility.com",
        "logo": "https://suitablefacility.com/assets/logo.png",
        "description": "Global integrated facility management and MEP engineering services.",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+971-564940635",
          "contactType": "customer service"
        }
      }
    },
    '/portugal': {
      title: 'Suitable Facility Portugal | Certified MEP & HVAC Technicians',
      description: 'Book certified HVAC, electrical and plumbing technicians across Portugal. Professional facility maintenance services for residential and commercial properties.',
      schema: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Suitable Facility Portugal",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "PT"
        },
        "description": "Certified MEP and HVAC technicians in Portugal."
      }
    },
    '/portugal/services': {
      title: 'MEP & Facility Management Services | Suitable Facility Portugal',
      description: 'Comprehensive facility services in Portugal: HVAC maintenance, electrical repairs, plumbing solutions, civil works, and fire safety systems.',
      schema: {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Facility Management",
        "provider": {
          "@type": "Organization",
          "name": "Suitable Facility"
        },
        "areaServed": "PT"
      }
    },
    '/portugal/technicians': {
      title: 'Find Top Certified Technicians in Portugal | Suitable Facility',
      description: 'Browse our network of vetted technicians in Portugal. View ratings, skills, and availability for MEP and facility maintenance tasks.',
    },
    '/uae': {
      title: 'Suitable Facility FZE UAE | Integrated MEP & Civil Infrastructure',
      description: 'Leading MEP and civil engineering infrastructure company in UAE. Specializing in pump stations, GRP tanks, and HVAC systems in Sharjah and Dubai.',
    }
  };

  constructor(
    private translate: TranslateService,
    private seoService: SeoService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.showScrollTop = window.scrollY > 300;
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  ngOnInit() {
    this.setupLanguage();
    this.setupSEO();
  }

  setupLanguage() {
    this.translate.addLangs(['en', 'ar', 'pt']);

    let defaultLang = 'en';

    if (isPlatformBrowser(this.platformId)) {
      const path = window.location.pathname;
      if (path.includes('/uae')) defaultLang = 'ar';
      else if (path.includes('/pt')) defaultLang = 'pt';
      else {
        const browserLang = this.translate.getBrowserLang();
        defaultLang = browserLang?.match(/en|ar|pt/) ? browserLang : 'en';
      }
    }

    this.setLanguage(defaultLang);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      const htmlTag = document.getElementsByTagName('html')[0];
      htmlTag.setAttribute('lang', lang);
      htmlTag.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }
  }

  setupSEO() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      // Scroll to top on navigation
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        // Trigger reveal check after route change
        setTimeout(() => this.initRevealOnScroll(), 100);
      }

      const routeData = this.seoMap[e.urlAfterRedirects] || this.seoMap[e.url] || this.seoMap['/'];
      
      this.seoService.updateMetaTags({
        title: routeData.title,
        description: routeData.description,
        keywords: routeData.keywords,
        url: 'https://suitablefacility.com' + e.urlAfterRedirects,
        schema: routeData.schema
      });

      this.showLayout = !e.urlAfterRedirects.includes('/admin');
    });
  }

  private initRevealOnScroll() {
    if (!isPlatformBrowser(this.platformId)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));
  }
}
