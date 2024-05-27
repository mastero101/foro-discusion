import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaMensajesComponent } from './lista-mensajes/lista-mensajes.component';
import { EnviarMensajeComponent } from './enviar-mensaje/enviar-mensaje.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: 'enviar-mensaje', component: EnviarMensajeComponent },
    { path: 'lista-mensajes', component: ListaMensajesComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent }
  ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }