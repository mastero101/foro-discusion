import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MensajeService } from '../mensaje.service';
import { AuthService } from '../auth.service';

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
  isAdmin: boolean = false;

  constructor(private mensajeService: MensajeService, private authService: AuthService) { }

  ngOnInit(): void {
    this.obtenerMensajes();
    this.isAdmin = this.authService.isAdmin();
  }

  obtenerMensajes() {
    this.mensajeService.obtenerMensajes()
      .then(mensajes => {
        this.mensajes = mensajes;
      })
      .catch(error => {
        console.error('Error al obtener los mensajes:', error);
      });
  }

  confirmarEliminarMensaje(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      this.eliminarMensaje(id);
    }
  }

  eliminarMensaje(id: string) {
    this.mensajeService.eliminarMensaje(id)
      .then(() => {
        this.mensajes = this.mensajes.filter(m => m._id !== id);
      })
      .catch(error => {
        console.error('Error al eliminar el mensaje:', error);
        alert('Error al eliminar el mensaje');
      });
  }

  actualizarMensajes() {
    this.obtenerMensajes();
  }
}
