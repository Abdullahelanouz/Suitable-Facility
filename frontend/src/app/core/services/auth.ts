import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Client' | 'Technician';
  phone?: string;
  location?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  bio?: string;
  avatar?: string;
  providedServices?: any[];
}



export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('sf_user');
      if (stored) {
        this.currentUserSubject.next(JSON.parse(stored));
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get token(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('sf_token');
    }
    return null;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, { email, password }).pipe(
      tap(res => this.storeSession(res))
    );
  }

  register(name: string, email: string, password: string, role: string, phone?: string, location?: string, experience?: number, hourlyRate?: number, bio?: string, avatar?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/register`, { name, email, password, role, phone, location, experience, hourlyRate, bio, avatar }).pipe(
      tap(res => this.storeSession(res))
    );
  }


  updateProfile(data: any): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.put<AuthResponse>(`${this.API}/update-profile`, data, { headers }).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('sf_user', JSON.stringify(res.user));
        }
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout() {

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('sf_token');
      localStorage.removeItem('sf_user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private storeSession(res: AuthResponse) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sf_token', res.token);
      localStorage.setItem('sf_user', JSON.stringify(res.user));
    }
    this.currentUserSubject.next(res.user);
  }
}
