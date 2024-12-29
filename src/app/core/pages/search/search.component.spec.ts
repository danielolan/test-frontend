import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SearchComponent } from './search.component';
import { DataService } from '../../services/data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let dataService: jasmine.SpyObj<DataService>;
  let router: Router;

  beforeEach(async () => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['fetchClientInfo']);

    await TestBed.configureTestingModule({
      imports: [
        SearchComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'summary', component: DummyComponent }, // Ruta simulada para "summary"
        ]),
      ],
      providers: [{ provide: DataService, useValue: dataServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should not set an error message if the client is found', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate'); // Espiar la navegación
    dataService.fetchClientInfo.and.returnValue(of({
      firstName: 'Test',
      secondName: 'Test',
      firstLastName: 'Test',
      secondSurname: 'Test',
      mobile: '1234567890',
      email: 'test@example.com',
      address: 'Test Address',
      cityResidence: 'Test City'
    }));

    // Configurar el formulario con valores válidos
    component.searchForm.patchValue({
      documentType: 'C',
      documentNumber: '12345678',
    });

    component.onSubmit();
    tick(); // Resolver la llamada asíncrona
    fixture.detectChanges();

    expect(component.errorMessage).toBe('');
    expect(navigateSpy).toHaveBeenCalledWith(['/summary']); // Verificar navegación
  }));
});

// Componente simulado para pruebas de navegación
@Component({
  template: '',
})
class DummyComponent {}
