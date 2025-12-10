import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/auth.service';

import { NgFor, DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [NgFor, DatePipe, NgIf, FormsModule, RouterLink]
})
export class DashboardComponent implements AfterViewInit {

  stats = {
    totalRevenue: 0,
    last7DaysRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  };

  todayStats = {
    revenueToday: 0,
    orderCount: 0,
    newCustomersToday: 0,
    avgOrderValue: 0
  };

  orderStatusStats = {
    paid: 0,
    pending: 0,
    cancelled: 0
  };

  latestOrders: any[] = [];
  lowStock: any[] = [];
  topSelling: any[] = [];

  selectedRange = 'weekly';
  salesLabels: string[] = [];
  salesValues: number[] = [];

  chart!: Chart;
  orderStatusChart!: Chart;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  ngAfterViewInit() {
    this.loadSales();
  }

  // =========================
  //       SALES CHART
  // =========================
  loadSales() {
    this.orderService.getSales(this.selectedRange).subscribe((res: any[]) => {

      this.salesLabels = res.map(r => r.label);
      this.salesValues = res.map(r => r.total);

      this.renderSalesChart();
      this.loadOrderStatusChart();
    });
  }

  renderSalesChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.salesLabels,
        datasets: [{
          label: 'Revenue (€)',
          data: this.salesValues,
          borderColor: "#007bff",
          borderWidth: 3,
          tension: 0.3,
          fill: false
        }]
      }
    });
  }

  // =========================
  //   ORDER STATUS CHART
  // =========================
  loadOrderStatusChart() {
    this.orderService.getOrderStatusStats().subscribe((stats: any) => {
      this.orderStatusStats = stats;

      const ctx = document.getElementById('orderStatusChart') as HTMLCanvasElement;
      if (!ctx) return;

      if (this.orderStatusChart) this.orderStatusChart.destroy();

      this.orderStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Paid', 'Pending', 'Cancelled'],
          datasets: [{
            data: [
              stats.paid,
              stats.pending,
              stats.cancelled
            ],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            hoverOffset: 10
          }]
        }
      });
    });
  }

  // =========================
  //        DASHBOARD
  // =========================
  loadDashboard() {
    // -------- Orders ---------
    this.orderService.getAllOrder().subscribe(orders => {

      this.stats.totalOrders = orders.length;
      this.stats.totalRevenue = orders.reduce((t, o) => t + o.totalPrice, 0);

      const last7Days = orders.filter(o =>
        new Date(o.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      this.stats.last7DaysRevenue = last7Days.reduce((t, o) => t + o.totalPrice, 0);

      this.latestOrders = orders
        .sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5);
    });

    // -------- Customers ---------
    this.userService.getAllUsers().subscribe(users => {
      this.stats.totalCustomers = users.length;
    });

    // -------- Products ---------
    this.productService.getAllProducts().subscribe(products => {
      this.stats.totalProducts = products.length;

      this.lowStock = products.filter(p => p.stock < 5);

      this.topSelling = [...products]
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5);
    });

    // -------- Today Stats ---------
    this.orderService.getTodayStats().subscribe((res: any) => {
      this.todayStats = res;
    });
  }
}

