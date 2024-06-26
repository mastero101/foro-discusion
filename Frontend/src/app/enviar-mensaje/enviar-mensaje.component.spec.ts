import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarMensajeComponent } from './enviar-mensaje.component';

describe('EnviarMensajeComponent', () => {
  let component: EnviarMensajeComponent;
  let fixture: ComponentFixture<EnviarMensajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviarMensajeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnviarMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
