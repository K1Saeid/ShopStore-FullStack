import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private authApi = `${environment.apiBaseUrl}/auth`;
  private userApi = `${environment.apiBaseUrl}/user`;

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.syncWithServer();  // بعد از refresh از Session واقعی backend می‌گیرد
  }

  // ============================================
  // AUTH
  // ============================================

  signup(data: any): Observable<any> {
    return this.http.post(`${this.authApi}/signup`, data, {
      withCredentials: true
    });
  }

  signin(credentials: any): Observable<any> {
  return this.http.post(`${this.authApi}/signin`, credentials, {
    withCredentials: true
  }).pipe(
    tap((user: any) => {
      this.setCurrentUser(user);
    })
  );
}


  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
    }
  }

  // ============================================
  // CURRENT USER SYNC
  // ============================================

  /** هنگام لود Angular از backend user واقعی را می‌گیرد */
  syncWithServer() {
    this.http.get(`${this.authApi}/current-user`, {
      withCredentials: true
    }).subscribe({
      next: (user: any) => {
        this.setCurrentUser(user);
      },
      error: () => {
        this.logout();
      }
    });
  }

  setCurrentUser(user: any) {
    if (this.isBrowser()) {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  getCurrentUser(): any {
    if (!this.isBrowser()) return null;
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // ============================================
  // USER CRUD
  // ============================================

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.authApi}/users`, {
      withCredentials: true
    });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.authApi}/users/${id}`, {
      withCredentials: true
    });
  }

  getUserAddresses(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/address/${userId}`, {
      withCredentials: true
    });
  }

  updateProfile(id: number, data: any) {
    return this.http.put(`${this.authApi}/update-profile/${id}`, data, {
      withCredentials: true
    });
  }

  // ============================================
  // ACTIVE USERS (ADMIN)
  // ============================================

  updateActivity(userId: number) {
    return this.http.post(
      `${this.userApi}/update-activity/${userId}`,
      {},
      { withCredentials: true }
    );
  }

  getActiveUsers() {
    return this.http.get<number>(`${this.userApi}/active-users`, {
      withCredentials: true
    });
  }

  startActivityPing(userId: number) {
    setInterval(() => {
      this.updateActivity(userId).subscribe();
    }, 30000);
  }
}
