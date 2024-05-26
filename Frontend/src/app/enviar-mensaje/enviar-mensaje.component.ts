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
  usuario: string = '';
  contenido: string = '';

  constructor() { }

  enviarMensaje() {
    if (this.usuario.trim() === '' || this.contenido.trim() === '') {
      alert('Por favor ingrese un usuario y un mensaje.');
      return;
    }

    const nuevoMensaje = { username: this.usuario, content: this.contenido };

    axios.post('https://foro-discusion.onrender.com/new-message', nuevoMensaje)
      .then(() => {
        alert('Mensaje enviado exitosamente');
        this.usuario = '';
        this.contenido = '';
      })
      .catch(error => {
        console.error('Error al enviar el mensaje:', error);
        alert('Ocurrió un error al enviar el mensaje.');
      });
  }
}
