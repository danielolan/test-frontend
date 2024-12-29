import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SummaryComponent } from './summary.component';
import { DataService } from '../../services/data.service';
import { of } from 'rxjs';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: any;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', ['selectedClient']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SummaryComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display client information if client data is available', () => {
    mockDataService.selectedClient = {
      firstName: 'Juan',
      secondName: 'Carlos',
      firstLastName: 'Pérez',
      secondSurname: 'Gómez',
      mobile: '123456789',
      address: 'Calle 123',
      cityResidence: 'Bogotá',
    };

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect((compiled.querySelector('#firstName') as HTMLInputElement)?.value).toBe('Juan');
    expect((compiled.querySelector('#secondName') as HTMLInputElement)?.value).toBe('Carlos');
    expect((compiled.querySelector('#lastName') as HTMLInputElement)?.value).toBe('Pérez');
    expect((compiled.querySelector('#secondLastName') as HTMLInputElement)?.value).toBe('Gómez');
    expect((compiled.querySelector('#mobile') as HTMLInputElement)?.value).toBe('123456789');
    expect((compiled.querySelector('#address') as HTMLInputElement)?.value).toBe('Calle 123');
    expect((compiled.querySelector('#cityResidence') as HTMLInputElement)?.value).toBe('Bogotá');
  });

  it('should display error message if client data is not available', () => {
    mockDataService.selectedClient = null;

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-danger')?.textContent).toContain(
      'No se encontró información del cliente.'
    );
  });

  it('should redirect to the search page if no client is selected on init', () => {
    mockDataService.selectedClient = null;

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search']);
  });

  it('should navigate back to the search page when "Volver" button is clicked', () => {
    const goBackSpy = spyOn(component, 'goBack').and.callThrough();

    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(goBackSpy).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search']);
  });
});
