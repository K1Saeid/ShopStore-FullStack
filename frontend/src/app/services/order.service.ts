import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private apiUrl = `${environment.apiBaseUrl}/Order`;

  constructor(private http: HttpClient) {}

  getOrdersByCustomer(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/by-customer/${userId}`);
  }

   placeOrder(orderPayload: any) {
  return this.http.post(`${this.apiUrl}/create`, orderPayload);
}

  getOrderDetails(id: number) {
      return this.http.get<any>(`${this.apiUrl}/details/${id}`);
    }

  getOrdersByUser(userId: number) {
   // return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
   return this.http.get<any[]>(`${this.apiUrl}/by-customer/${userId}`);
  }

 getAllOrders() {
    return this.http.get<any[]>(`${this.apiUrl}`);
   
  }
  getAllOrder() {
   return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  updateOrderStatus(id: number, status: string) {
    return this.http.put(`${this.apiUrl}/update-status/${id}`, { status });
  }

  getSales(range: string) {
    return this.http.get(`${this.apiUrl}/sales?range=${range}`);
  }
  getTodayStats() {
    return this.http.get(`${this.apiUrl}/stats/today`);
  }

  getOrderStatusStats() {
    return this.http.get(`${this.apiUrl}/stats/status`);
  }

}
