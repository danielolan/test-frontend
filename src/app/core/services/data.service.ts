import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Client {
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondSurname: string;
  mobile: string;
  address: string;
  cityResidence: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8090/api/v1/clientes';

  // Guarda la información del cliente seleccionado
  selectedClient: Client | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Busca un cliente por tipo y número de documento directamente en la API.
   * @param docType El tipo de documento (p.ej. "CC", "PAS").
   * @param docNumber El número de documento (p.ej. "12345678").
   * @returns Un observable con los datos del cliente o `null` si no se encuentra.
   */
  fetchClientInfo(docType: string, docNumber: string): Observable<Client | null> {
    const url = `${this.apiUrl}?docType=${docType}&docNumber=${docNumber}`;
    return this.http.get<Client | null>(url); // Solicitud directa a la API
  }
}
