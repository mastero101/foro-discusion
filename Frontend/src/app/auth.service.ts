import { Injectable } from '@angular/core';
import axios from 'axios';

import * as CryptoJS from 'crypto-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private usuarioActual: string | null = null;
    private endpoint = environment.endpoint

    private secretKey = environment.secretKey;
    
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

    getToken(): string {
      return localStorage.getItem('token') || '';
    }
  
    getEndpoint(): string {
      return this.endpoint;
    }

    isAdmin(): boolean {
      const adminEncrypted = localStorage.getItem('admin');
      if (adminEncrypted) {
        const adminDecrypted = this.decryptAdmin(adminEncrypted);
        return adminDecrypted;
      }
      return false;
    }

    isAuthenticated(): boolean {
      const token = this.getToken();
      // Simple validation to check if the token exists and is not expired
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      }
      return false;
    }

    // Función para cifrar el valor del administrador
    encryptAdmin(value: boolean): string {
      const encrypted = CryptoJS.AES.encrypt(String(value), this.secretKey).toString();
      return encrypted;
    }

    // Función para descifrar el valor del administrador
    decryptAdmin(encryptedValue: string): boolean {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
      const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return decrypted === 'true';
    }

    login(username: string, password: string): Promise<void> {
      localStorage.clear();
        return axios.post<any>( this.endpoint + '/auth/login', { username, password })
          .then(response => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            const adminEncrypted = this.encryptAdmin(response.data.admin);
            localStorage.setItem('admin', adminEncrypted);
          });
    }
}

