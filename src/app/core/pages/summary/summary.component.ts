import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, Client } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  imports: [CommonModule],
})
export class SummaryComponent implements OnInit {
  client: Client | null = null;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    // Obtener el cliente seleccionado
    this.client = this.dataService.selectedClient;

    if (!this.client) {
      // Si no hay cliente seleccionado, redirigir a la página de búsqueda
      this.router.navigate(['/search']);
    }
  }

  goBack(): void {
    // Redirigir a la página de búsqueda
    this.router.navigate(['/search']);
  }
}
