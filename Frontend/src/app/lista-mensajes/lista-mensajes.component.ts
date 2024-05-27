import { Component, OnInit } from '@angular/core';
import axios from 'axios';

import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { EnviarMensajeComponent } from '../enviar-mensaje/enviar-mensaje.component';

@Component({
  selector: 'app-lista-mensajes',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    EnviarMensajeComponent
  ],
  templateUrl: './lista-mensajes.component.html',
  styleUrl: './lista-mensajes.component.scss'
})
export class ListaMensajesComponent implements OnInit {
  mensajes: any[] = [];
  usuarioActual: string = 'nombreDeUsuario';

  endpoint = "https://foro-discusion.onrender.com"
  endpoint2 = "http://localhost:5000"

  constructor() { }

  ngOnInit(): void {
    this.obtenerMensajes();
  }

  obtenerMensajes() {
    axios.get<any[]>(this.endpoint + '/messages')
      .then(response => {
        this.mensajes = response.data;
      })
      .catch(error => {
        console.error('Error al obtener los mensajes:', error);
      });
  }

  eliminarMensaje(id: string) {
    const token = localStorage.getItem('token');
    if (token && confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      axios.delete(`https://foro-discusion.onrender.com/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        this.mensajes = this.mensajes.filter(m => m._id !== id);
      })
      .catch(error => {
        console.error('Error al eliminar el mensaje:', error);
        alert('Error al eliminar el mensaje');
      });
    }
  }

  actualizarMensajes() {
    this.obtenerMensajes();
  }
}
