import { Component, OnInit } from '@angular/core';
import { CursosService } from './Componentes/services/cursos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AbmCursosComponent } from './abm-cursos/abm-cursos.component';
import { Curso } from './Componentes/models/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../../core/models/index'
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environments';



@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss'],
})
export class CursosComponent implements OnInit {
  dataSource = new MatTableDataSource<Curso>();
  displayedColumns = ['id', 'nombre', 'fecha_inicio', 'fecha_fin', 'acciones'];

  authUser$: Observable<Usuario | null>;
  role: string | null | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cursosService: CursosService,
    private dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.authUser$ = this.authService.obtenerUsuarioAutenticado();
  }

  abrirDetallesCurso(cursoId: number): void {
    this.router.navigate([cursoId], {
      relativeTo: this.activatedRoute,
    });
  }

  ngOnInit(): void {
    this.authUser$.subscribe((user: Usuario | null) => {
      if (user) {
        this.role = user.role;
      } else {
        this.role = null;
      }
    });



    this.cursosService.obtenerCursos().subscribe((cursos: Curso[]) => {
      this.dataSource.data = cursos;
    });


  }

  abrirABMCursos(): void {
    const dialog = this.dialog.open(AbmCursosComponent);

    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        this.http.post<Curso>(enviroment.apiBaseUrl + '/cursos', valor).subscribe((nuevoCurso: Curso) => {
          this.dataSource.data = [...this.dataSource.data, nuevoCurso];
        });
      }
    });
  }

  editarCurso(curso: Curso): void {
    const dialog = this.dialog.open(AbmCursosComponent, {
      data: {
        curso: curso,
      },
    });

    dialog.afterClosed().subscribe((dataDelCursoEditado) => {
      if (dataDelCursoEditado) {
        const url = `${enviroment.apiBaseUrl}/cursos/${curso.id}`;
        this.http.put(url, dataDelCursoEditado).subscribe(() => {
          const index = this.dataSource.data.findIndex((c) => c.id === curso.id);
          if (index !== -1) {
            this.dataSource.data[index] = { ...curso, ...dataDelCursoEditado };
            this.dataSource = new MatTableDataSource(this.dataSource.data);
          }
        });
      }
    });
  }

  eliminarCurso(curso: Curso): void {
    if (confirm('¿Está seguro?')) {
      this.cursosService.eliminarCurso(curso.id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((c) => c.id !== curso.id);
      });
    }
  }

  aplicarFiltros(ev: Event): void {
    const inputValue = (ev.target as HTMLInputElement)?.value;
    this.dataSource.filter = inputValue?.trim()?.toLowerCase();
  }

  isAdminUser(): boolean {
    return this.role === 'admin';
  }
}




