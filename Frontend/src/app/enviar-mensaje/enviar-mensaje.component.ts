import { Component, Output, EventEmitter } from '@angular/core';
import axios from 'axios';

import { AuthService } from '../auth.service';

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

  endpoint = "https://foro-discusion.onrender.com"
  endpoint2 = "http://localhost:5000"

  constructor(private authService: AuthService) { }

  enviarMensaje() {
    const usuarioActual = this.authService.getUsername();
    const token = localStorage.getItem('token');
    if (this.mensaje && usuarioActual && token) {
      axios.post(this.endpoint + '/new-message', {
        username: usuarioActual,
        content: this.mensaje
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Mensaje enviado:', this.mensaje);
        this.mensaje = '';
        this.mensajeEnviado.emit();
      })
      .catch(error => {
        console.error('Error al enviar el mensaje:', error);
      });
    }
  }
  
}
