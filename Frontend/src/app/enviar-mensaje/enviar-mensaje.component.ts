import { Component } from '@angular/core';
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

  constructor(private authService: AuthService) { }

  enviarMensaje() {
    const usuarioActual = this.authService.getUsername();
    const token = localStorage.getItem('token');
    console.log(usuarioActual,this.mensaje,token)
    if (this.mensaje && usuarioActual && token) {
      axios.post('https://foro-discusion.onrender.com/new-message', {
        content: this.mensaje
      }, {
        headers: {
          'Authorization': `Bearer ${token}` // Pasar el token JWT en la cabecera de la solicitud
        }
      })
      .then(response => {
        console.log('Mensaje enviado:', this.mensaje);
        this.mensaje = ''; // Limpiar el campo de mensaje después de enviarlo
      })
      .catch(error => {
        console.error('Error al enviar el mensaje:', error);
      });
    }
  }
}
