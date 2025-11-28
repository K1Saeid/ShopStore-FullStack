import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = `${environment.apiBaseUrl}/Address`;

  constructor(private http: HttpClient) {}

  // GET: get addresses by user
    addAddress(userId: number, data: any) {
      return this.http.post(`${this.apiUrl}/${userId}`, data);
    }



  getByUserId(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`, { withCredentials: true });
  }


  // PUT: update address
  updateAddress(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data , { withCredentials: true });
  }

  // DELETE: delete address
  deleteAddress(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
