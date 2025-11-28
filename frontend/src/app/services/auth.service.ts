import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}/Auth`;
  private userApi = `${environment.apiBaseUrl}/User`;

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {

    if (this.isBrowser()) {
      const user = this.getCurrentUser();
      if (user) this.currentUserSubject.next(user);
    }
  }

  // ===========================
  // AUTH
  // ===========================

  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  signin(user: any) {
    return this.http.post(`${this.apiUrl}/signin`, user, {
      withCredentials: true
    });
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
    }
  }

  setCurrentUser(user: any): void {
    if (this.isBrowser()) {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  getCurrentUser(): any {
    if (!this.isBrowser()) return null;

    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // ===========================
  // USER CRUD
  // ===========================

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  getUserAddresses(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  updateProfile(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/update-profile/${id}`, data);
  }

  // ===========================
  // ACTIVE USERS (REAL-TIME)
  // ===========================

  /** پینگ کردن فعالیت کاربر */
  updateActivity(userId: number) {
    return this.http.post(
      `${this.userApi}/update-activity/${userId}`,
      {}
    );
  }

  /** گرفتن تعداد کاربران فعال */
  getActiveUsers() {
    return this.http.get<number>(
      `${this.userApi}/active-users`
    );
  }

  /** پینگ هر 30 ثانیه */
  startActivityPing(userId: number) {
    setInterval(() => {
      this.updateActivity(userId).subscribe();
    }, 30000);
  }

}
