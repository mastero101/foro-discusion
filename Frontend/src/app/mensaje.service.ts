import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private authService: AuthService) { }

  obtenerMensajes() {
    const endpoint = this.authService.getEndpoint();
    return axios.get<any[]>(`${endpoint}/messages`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error al obtener los mensajes:', error);
        throw error;
      });
  }

  enviarMensaje(mensaje: string) {
    const usuarioActual = this.authService.getUsername();
    const token = this.authService.getToken();
    const endpoint = this.authService.getEndpoint();

    if (mensaje && usuarioActual && token) {
      return axios.post(`${endpoint}/new-message`, {
        username: usuarioActual,
        content: mensaje
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.data)
      .catch(error => {
        console.error('Error al enviar el mensaje:', error);
        throw error;
      });
    } else {
      return Promise.reject('Datos insuficientes para enviar el mensaje');
    }
  }

  eliminarMensaje(id: string) {
    const token = this.authService.getToken();
    const endpoint = this.authService.getEndpoint();

    if (token) {
      return axios.delete(`${endpoint}/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => response.data)
      .catch(error => {
        console.error('Error al eliminar el mensaje:', error);
        throw error;
      });
    } else {
      return Promise.reject('Token no encontrado');
    }
  }
}
