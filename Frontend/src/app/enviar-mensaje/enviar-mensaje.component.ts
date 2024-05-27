import { Component } from '@angular/core';
import axios from 'axios';

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

  constructor() { }

  enviarMensaje() {
    const usuarioActual = ''; // Aquí obtén el usuario actual (por ejemplo, desde tu servicio de autenticación)
    if (this.mensaje && usuarioActual) {
      axios.post('https://foro-discusion.onrender.com/new-message', {
        username: usuarioActual,
        content: this.mensaje
      })
      .then(response => {
        console.log('Mensaje enviado:', this.contenido);
        this.mensaje = ''; // Limpiar el campo de mensaje después de enviarlo
      })
      .catch(error => {
        console.error('Error al enviar el mensaje:', error);
      });
    }
  }
}
