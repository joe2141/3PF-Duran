import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-abm-inscripciones',
  templateUrl: './abm-inscripciones.component.html',
  styleUrls: ['./abm-inscripciones.component.scss']
})
export class AbmInscripcionesComponent {
  nombreControl = new FormControl('', [Validators.required, Validators.minLength(3),]);
  cursoControl = new FormControl('',[Validators.required,Validators.minLength(3),]);
  fechaControl = new FormControl('',[Validators.required,]);

  inscripcionesForms = new FormGroup({
    nombre: this.nombreControl,
    curso: this.cursoControl,
    fecha: this.fechaControl
  })

  constructor(
    private dialogRef: MatDialogRef<AbmInscripcionesComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    if (data) {
      this.nombreControl.setValue(data.inscripcionesParaEditar.nombre);
    }
  }

  guardar(): void {
    if (this.inscripcionesForms.valid) {
      this.dialogRef.close(this.inscripcionesForms.value);
    } else {
      this.inscripcionesForms.markAllAsTouched();
    }
  }

}
