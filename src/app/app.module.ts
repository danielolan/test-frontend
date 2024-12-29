import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent], // Otros componentes que no sean standalone
  imports: [
    BrowserModule, 
    ReactiveFormsModule // Formularios Reactivos
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
