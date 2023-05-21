import { Injectable } from '@angular/core';
import { Inscripciones } from '../models/index';
import { BehaviorSubject, Observable, map, } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../../../../environments/environments';

@Injectable({
    providedIn: 'root'
})

export class InscripcionesService {

  private inscripciones$ = new BehaviorSubject<Inscripciones[]>([]);

  constructor(private http: HttpClient) {
    this.fetchInscripciones(); // Llamar al método para obtener las inscripciones al iniciar el servicio
  }

  obtenerInscripciones(): Observable<Inscripciones[]> {
    return this.inscripciones$.asObservable();
  }

  obtenerInscripcionesPorId(id: number): Observable<Inscripciones | undefined> {
    return this.inscripciones$.asObservable()
      .pipe(
        map((inscripciones) => inscripciones.find((a) => a.id === id))
      );
  }

  obtenerInscripcionesPorAlumnoId(id: number): Observable<Inscripciones[]> {
    return this.inscripciones$.asObservable()
      .pipe(
        map((inscripciones) => inscripciones.filter((a) => a.alumnoId === id))
      );
  }

  obtenerInscripcionesPorCursoId(id: number): Observable<Inscripciones[]> {
    return this.inscripciones$.asObservable()
      .pipe(
        map((inscripciones) => inscripciones.filter((a) => a.cursoId === id))
      );
  }

  private fetchInscripciones() {
    this.http.get<Inscripciones[]>(`${enviroment.apiBaseUrl}/inscripciones`)
      .subscribe(
        (inscripciones) => {
          this.inscripciones$.next(inscripciones);
        },
        (error) => {
          console.log('Error al obtener las inscripciones:', error);
        }
      );
  }
}
