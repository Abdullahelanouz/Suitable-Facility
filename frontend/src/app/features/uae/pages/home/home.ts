import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  private apiService = inject(ApiService);

  bookingModalActive = false;
  selectedService = '';
  bookingSuccess = false;
  isSubmitting = false;

  form = { name: '', phone: '', email: '', message: '' };
  contactForm = { name: '', email: '', message: '' };

  services = [
    {
      title: 'Electromechanical Engineering Design',
      img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
      items: ['Electrical System Design.', 'HVAC System Design.', 'Plumbing and Drainage System Design.']
    },
    {
      title: 'Mechanical Services',
      img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
      items: ['HVAC Systems (Centralized, Split, Ducted).', 'Chilled water system & chiller plants.', 'Refrigeration & Ventilation Systems.', 'Preventive Maintenance & Inspection.', 'Air/Water Flow & Quality Testing.']
    },
    {
      title: 'Plumbing Services',
      img: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=800&auto=format&fit=crop',
      items: ['Design & Installation of plumbing/drainage.', 'Pump & Tank Installation.', 'Complete Piping Works.', 'Sanitary wares fixing.', 'Potable Water Booster Systems.']
    },
    {
      title: 'Electrical & Fire Safety Systems',
      img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
      items: ['Electrical Engineering & Product Selection.', 'Installations of Panel Systems (MDBs, SMDBs).', 'BMS & Busbar System Installation.', 'Low Current & Low Voltage Systems.', 'Fire Alarm & Emergency Lighting.']
    },
    {
      title: 'GRP Water Tanks',
      img: 'https://royal.ps/storage/products/April2021/YIfUFeHBPbosPNGZ9V7F.jpg',
      items: ['Calculation of required water capacity.', 'Study and design for the required foundation.', 'Complete installation of GRP tanks.', 'Piping and connection to pump systems.']
    },
    {
      title: 'Pump Station Installation',
      img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=800&auto=format&fit=crop',
      items: ['Complete Pump station installation.', 'Integration with existing water systems.', 'Piping and valve installations.', 'Electric panels and cable wiring setup.']
    },
    {
      title: 'Infrastructure Activity',
      img: 'https://davepools.com/wp-content/uploads/2025/08/drainage-pipe-types.webp',
      items: ['Underground drainage pipe (PVC & GRP).', 'Underground water supply HDPE pipe.', 'Drainage lifting station design.', 'Dismantling existing ADDC/ADSSC systems.', 'Soft Landscape and irrigation systems.']
    },
    {
      title: 'Building Activity',
      img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
      items: ['Pumping work for ADDC and ADSC.', 'Firefighting work and installation.', 'District cooling system & ETS rooms.', 'Value engineering for matching client specs.']
    },
    {
      title: 'Architectural & City Planning',
      img: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop',
      items: ['Design for meeting rooms, offices & entrances.', 'Decor false ceiling & Gypsum Column.', 'Flooring design and installation.', 'Wall design, Painting & Wooden work.']
    }
  ];

  documents = [
    { title: 'Permanent Certificate', icon: 'fa-file-pdf', iconColor: '#ef4444', url: 'https://drive.google.com/file/d/1l1Cq3oCQGrsXtSGNkSVIJ42Q9s6eyIAH/view?usp=drivesdk' },
    { title: 'Institute of Records and Notary', icon: 'fa-file-contract', iconColor: 'var(--accent)', url: 'https://drive.google.com/file/d/16z6LfBNLjmfbScM9Wx3DZswtSFKituAt/view?usp=drivesdk' },
    { title: 'Central Registration of Beneficiary', icon: 'fa-file-signature', iconColor: '#059669', url: 'https://drive.google.com/file/d/16q2TApyJs6diM-pecPKbrmz6JN_Iwdnx/view?usp=drivesdk' },
    { title: 'Rental Invoice (Lisbon Office)', icon: 'fa-file-invoice', iconColor: '#3b82f6', url: 'https://drive.google.com/file/d/16twTiZxiNAWqhND2r3p1Unkdybjxiym-/view?usp=drivesdk' }
  ];

  openBookingModal(serviceName: string) {
    this.selectedService = serviceName;
    this.bookingModalActive = true;
    this.bookingSuccess = false;
    this.isSubmitting = false;
    this.form = { name: '', phone: '', email: '', message: '' };
  }

  closeBookingModal() {
    this.bookingModalActive = false;
  }

  confirmBooking(e: Event) {
    e.preventDefault();
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    const payload = {
      ...this.form,
      service: this.selectedService
    };

    this.apiService.submitUaeInquiry(payload).subscribe({
      next: () => {
        this.bookingSuccess = true;
        this.isSubmitting = false;
        setTimeout(() => this.closeBookingModal(), 2500);
      },
      error: (err) => {
        console.error('Inquiry error:', err);
        this.isSubmitting = false;
        alert('Something went wrong. Please try again.');
      }
    });
  }

  submitGeneralInquiry() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    const payload = {
      ...this.contactForm
    };

    this.apiService.submitContact(payload).subscribe({
      next: () => {
        alert('Message sent successfully!');
        this.isSubmitting = false;
        this.contactForm = { name: '', email: '', message: '' };
      },
      error: (err) => {
        console.error('Contact error:', err);
        this.isSubmitting = false;
        alert('Error sending message.');
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 150) {
        el.classList.add('active');
      }
    });
  }
}

