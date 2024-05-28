import { Injectable } from '@angular/core';
import axios from 'axios';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private usuarioActual: string | null = null;
    private endpoint2 = "https://foro-discusion.onrender.com"
    private endpoint = "http://localhost:5000"

    private secretKey = "F_OBd0lnTWxMsy10mvcHQHvUg5yU14hTNyAqylyU2ECwvp2hKpHXREKBKNWKO67u";
    
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

