import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private usuarioActual: string | null = null;
    
    constructor() { }

    // Método para establecer el usuario actual
    setUsuarioActual(usuario: string): void {
        this.usuarioActual = usuario;
    }

    // Método para obtener el usuario actual
    getUsuarioActual(): string | null {
        return this.usuarioActual;
    }

    getUsername(): string | null {
        return localStorage.getItem('username');
    }

    login(username: string, password: string): Promise<void> {
        return axios.post<any>('https://foro-discusion.onrender.com/auth/login', { username, password })
          .then(response => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
          });
    }

    // Método para iniciar sesión y obtener el token JWT
    iniciarSesion(username: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post<any>('https://foro-discusion.onrender.com/auth/login', { username, password })
            .then(response => {
                const token = response.data.token;
                localStorage.setItem('token', token);
                // Decodificar el token JWT para obtener el nombre de usuario
                const usuarioActual = this.obtenerUsuarioDesdeToken(token);
                if (usuarioActual !== null) {
                this.setUsuarioActual(usuarioActual);
                resolve();
                } else {
                reject(new Error('El usuario actual es nulo'));
                }
            })
            .catch(error => {
                console.error('Error al iniciar sesión:', error);
                reject(error);
            });
        });
    }
  
  // Método para obtener el nombre de usuario desde el token JWT
  private obtenerUsuarioDesdeToken(token: string): string | null {
    // Decodificar el token JWT para obtener la información del usuario
    // Aquí deberías utilizar una librería para decodificar tokens JWT, como jsonwebtoken o jwt-decode
    // Por ejemplo:
    // const decodedToken = jwt_decode(token);
    // return decodedToken.username;
    return null; // Temporalmente retornamos null ya que no tenemos la implementación completa
  }
}

