import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReseñaService } from './reseña.service';
import { ReseñaEntity } from './reseña.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReseñaService', () => {
  let service: ReseñaService;
  let reseñaRepo: Repository<ReseñaEntity>;
  let actividadRepo: Repository<ActividadEntity>;
  let estudianteRepo: Repository<EstudianteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReseñaService],
    }).compile();

    service = module.get<ReseñaService>(ReseñaService);
    reseñaRepo = module.get(getRepositoryToken(ReseñaEntity));
    actividadRepo = module.get(getRepositoryToken(ActividadEntity));
    estudianteRepo = module.get(getRepositoryToken(EstudianteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('agregarReseña', () => {
    it('debería lanzar error si la actividad no existe', async () => {
      const reseña = reseñaRepo.create({
        comentario: 'Muy buena',
        calificacion: 5,
        fecha: '2025-06-01',
        actividad: { id: 'actividad-no-existe' } as ActividadEntity,
        estudiante: { id: 'estudiante-1' } as EstudianteEntity,
      });

      await expect(service.agregarReseña(reseña)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar error si la actividad no está finalizada', async () => {
      const estudiante = await estudianteRepo.save(estudianteRepo.create({
        cedula: 1,
        nombre: 'Carlos',
        correo: 'carlos@test.com',
        programa: 'Historia',
        semestre: 5,
      }));

      const actividad = await actividadRepo.save(actividadRepo.create({
        titulo: 'Exposición de historia',
        fecha: '2025-06-01',
        cupoMaximo: 10,
        estado: 0,
        estudiantes: [estudiante],
      }));

      // Asignar actividad al estudiante
      estudiante.actividades = [actividad];
      await estudianteRepo.save(estudiante);

      const reseña = reseñaRepo.create({
        comentario: 'No finalizada',
        calificacion: 4,
        fecha: '2025-06-02',
        actividad: { id: actividad.id } as ActividadEntity,
        estudiante: { id: estudiante.id } as EstudianteEntity,
      });

      await expect(service.agregarReseña(reseña)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar error si el estudiante no existe', async () => {
      const actividad = await actividadRepo.save(actividadRepo.create({
        titulo: 'Concierto Final',
        fecha: '2025-06-10',
        cupoMaximo: 10,
        estado: 2, 
        estudiantes: [],
      }));

      const reseña = reseñaRepo.create({
        comentario: 'Excelente',
        calificacion: 5,
        fecha: '2025-06-12',
        actividad: { id: actividad.id } as ActividadEntity,
        estudiante: { id: 'no-existe' } as EstudianteEntity,
      });

      await expect(service.agregarReseña(reseña)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar error si el estudiante no está inscrito', async () => {
      const estudiante = await estudianteRepo.save(estudianteRepo.create({
        cedula: 2,
        nombre: 'Ana',
        correo: 'ana@test.com',
        programa: 'Filosofía',
        semestre: 4,
        actividades: [],
      }));

      const actividad = await actividadRepo.save(actividadRepo.create({
        titulo: 'Charla de filosofía',
        fecha: '2025-06-20',
        cupoMaximo: 15,
        estado: 2,
        estudiantes: [],
      }));

      const reseña = reseñaRepo.create({
        comentario: 'Muy profunda',
        calificacion: 5,
        fecha: '2025-06-21',
        actividad: { id: actividad.id } as ActividadEntity,
        estudiante: { id: estudiante.id } as EstudianteEntity,
      });

      await expect(service.agregarReseña(reseña)).rejects.toThrow(BadRequestException);
    });

    it('debería guardar la reseña si todo es válido', async () => {
      const estudiante = await estudianteRepo.save(estudianteRepo.create({
        cedula: 3,
        nombre: 'Luis',
        correo: 'luis@test.com',
        programa: 'Música',
        semestre: 6,
      }));

      const actividad = await actividadRepo.save(actividadRepo.create({
        titulo: 'Festival musical',
        fecha: '2025-06-30',
        cupoMaximo: 20,
        estado: 2,
        estudiantes: [estudiante],
      }));

      estudiante.actividades = [actividad];
      await estudianteRepo.save(estudiante);

      const reseña = reseñaRepo.create({
        comentario: 'Espectacular evento',
        calificacion: 5,
        fecha: '2025-07-01',
        actividad: { id: actividad.id } as ActividadEntity,
        estudiante: { id: estudiante.id } as EstudianteEntity,
      });

      const resultado = await service.agregarReseña(reseña);
      expect(resultado).toBeDefined();
      expect(resultado.id).toBeDefined();
      expect(resultado.comentario).toBe('Espectacular evento');
    });
  });
});
