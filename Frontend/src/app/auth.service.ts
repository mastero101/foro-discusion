import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private usuarioActual: string | null = null;
    endpoint = "https://foro-discusion.onrender.com"
    endpoint2 = "http://localhost:5000"
    
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
        return axios.post<any>( this.endpoint + '/auth/login', { username, password })
          .then(response => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
          });
    }
}

