import { Component, OnInit } from '@angular/core';
import axios from 'axios';

import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

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
    EnviarMensajeComponent
  ],
  templateUrl: './lista-mensajes.component.html',
  styleUrl: './lista-mensajes.component.scss'
})
export class ListaMensajesComponent implements OnInit {
  mensajes: any[] = [];
  usuarioActual: string = 'nombreDeUsuario';

  constructor() { }

  ngOnInit(): void {
    this.obtenerMensajes();
  }

  obtenerMensajes() {
    axios.get<any[]>('http://localhost:5000/messages')
      .then(response => {
        this.mensajes = response.data;
      })
      .catch(error => {
        console.error('Error al obtener los mensajes:', error);
      });
  }
}
