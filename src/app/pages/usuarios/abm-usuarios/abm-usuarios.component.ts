import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbmCursosComponent } from '../../cursos/abm-cursos/abm-cursos.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-abm-usuarios',
  templateUrl: './abm-usuarios.component.html',
  styleUrls: ['./abm-usuarios.component.scss']
})
export class AbmUsuariosComponent {
  nombreControl = new FormControl('', [Validators.required, Validators.minLength(3),]);
  correoControl = new FormControl('', [Validators.required, Validators.email]);
  contrasenaControl = new FormControl('', [Validators.required, Validators.minLength(3),]);

  usuarioFrom = new FormGroup({
    nombre: this.nombreControl,
    email: this.correoControl,
    password: this.contrasenaControl,
  })
  constructor(
    private dialogRef: MatDialogRef<AbmUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      const usuarioParaEditar = data.usuario;
      this.nombreControl.setValue(usuarioParaEditar.nombre);
      this.correoControl.setValue(usuarioParaEditar.email);
      this.contrasenaControl.setValue(usuarioParaEditar.password);
    }
  }

  guardar(): void {
    if (this.usuarioFrom.valid) {
      this.dialogRef.close(this.usuarioFrom.value);
    } else {
      this.usuarioFrom.markAllAsTouched();
    }
  }

}
