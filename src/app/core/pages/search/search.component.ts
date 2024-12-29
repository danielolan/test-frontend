import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service'; // Importa el servicio

@Component({
  selector: 'app-search',
  standalone: true, // Componente standalone
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [CommonModule, ReactiveFormsModule], // Importar CommonModule y ReactiveFormsModule
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  errorMessage: string = '';

  docTypes = [
    { label: 'Cédula de ciudadanía', value: 'C' },
    { label: 'Pasaporte', value: 'P' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      documentType: ['', Validators.required], // Campo obligatorio
      documentNumber: [
        '',
        [
          Validators.required,
          this.documentNumberValidator.bind(this), // Validador personalizado
        ],
      ],
    });
  }

  get documentNumberControl(): AbstractControl {
    return this.searchForm.get('documentNumber')!;
  }

  // Validador personalizado: asegura que sea un número entre 8 y 11 dígitos
  documentNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const rawValue = (control.value || '').replace(/\./g, ''); // Remover puntos

    if (!rawValue) {
      return { required: true };
    }
    if (!/^[0-9]*$/.test(rawValue)) {
      return { pattern: true }; // Solo números
    }
    if (rawValue.length < 8 || rawValue.length > 11) {
      return { lengthError: true }; // Longitud no válida
    }

    return null; // Sin errores
  }

  // Manejar entrada del número de documento (formatear con puntos)
  onDocumentNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Obtener solo números
    let rawValue = input.value.replace(/\D/g, '');

    // Limitar a 11 dígitos
    if (rawValue.length > 11) {
      rawValue = rawValue.substring(0, 11);
    }

    // Agregar separadores de miles (puntos)
    const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Actualizar el valor visual e interno
    input.value = formattedValue;
    this.documentNumberControl.setValue(formattedValue, { emitEvent: false }); // Valor con puntos
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const { documentType, documentNumber } = this.searchForm.value;
  
      // Eliminar los puntos antes de enviar
      const cleanedDocumentNumber = documentNumber.replace(/\./g, '');
  
      // Llamar al servicio para buscar el cliente
      this.dataService.fetchClientInfo(documentType, cleanedDocumentNumber).subscribe(
        (client) => {
          if (client) {
            // Si el cliente existe, guardarlo y navegar a summary
            this.dataService.selectedClient = client;
            this.router.navigate(['/summary']);
          } else {
            // Si no existe, mostrar un mensaje de error
            this.errorMessage = 'Usuario no encontrado. Intenta de nuevo.';
          }
        },
        (error) => {
          // Manejar errores según el código de estado HTTP
          if (error.status === 400) {
            this.errorMessage = 'Solicitud inválida. Por favor, verifica los datos ingresados.';
          } else if (error.status === 404) {
            this.errorMessage = 'Usuario no encontrado. Por favor, intenta de nuevo.';
          } else if (error.status === 500) {
            this.errorMessage = 'Error interno del servidor. Intenta más tarde.';
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
          }
          console.error('Error:', error);
        }
      );
    }
  }
  
  
}
