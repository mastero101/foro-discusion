import { Component, Output, EventEmitter } from '@angular/core';

import { MensajeService } from '../mensaje.service';

import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-enviar-mensaje',
  standalone: true,
  imports: [
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './enviar-mensaje.component.html',
  styleUrl: './enviar-mensaje.component.scss'
})
export class EnviarMensajeComponent {
  mensaje: string = '';
  contenido: string = '';

  @Output() mensajeEnviado = new EventEmitter<void>();

  constructor(private mensajeService: MensajeService) { }

  enviarMensaje() {
    this.mensajeService.enviarMensaje(this.mensaje)
      .then(() => {
        console.log('Mensaje enviado:', this.mensaje);
        this.mensaje = '';
        this.mensajeEnviado.emit();
      })
      .catch(error => {
        console.error('Error al enviar el mensaje:', error);
      });
  }
  
}
