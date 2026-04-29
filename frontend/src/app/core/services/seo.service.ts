import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateMetaTags(config: any) {
    this.titleService.setTitle(config.title);

    // Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: config.description });
    this.metaService.updateTag({ name: 'keywords', content: config.keywords || 'MEP, Facility Management, Technicians, Portugal, UAE' });

    // Open Graph / Facebook
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:image', content: config.image || 'https://suitablefacility.com/assets/og-image.jpg' });
    this.metaService.updateTag({ property: 'og:url', content: config.url || 'https://suitablefacility.com' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    // Twitter
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    this.metaService.updateTag({ name: 'twitter:image', content: config.image || 'https://suitablefacility.com/assets/og-image.jpg' });

    // Canonical Link
    this.updateCanonicalUrl(config.url || 'https://suitablefacility.com');

    // Schema.org (JSON-LD)
    if (config.schema) {
      this.updateSchema(config.schema);
    }
  }

  private updateCanonicalUrl(url: string) {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private updateSchema(schema: any) {
    let script = this.document.getElementById('json-ld-schema') as HTMLScriptElement;
    if (script) {
      script.text = JSON.stringify(schema);
    } else {
      script = this.document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      this.document.head.appendChild(script);
    }
  }
}
