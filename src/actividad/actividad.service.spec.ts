import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ActividadService', () => {
  let service: ActividadService;
  let actividadRepo: Repository<ActividadEntity>;
  let estudianteRepo: Repository<EstudianteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    actividadRepo = module.get<Repository<ActividadEntity>>(getRepositoryToken(ActividadEntity));
    estudianteRepo = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearActividad', () => {
    it('debería crear una actividad válida', async () => {
      const actividad = actividadRepo.create({
        titulo: 'Exposición de arte y cultura',
        fecha: '2025-06-01',
        cupoMaximo: 10,
      });

      const resultado = await service.crearActividad(actividad);
      expect(resultado).toBeDefined();
      expect(resultado.id).toBeDefined();
      expect(resultado.estado).toBe(0);
    });
  });

  describe('findActividadesByDate', () => {
    it('debería retornar actividades por fecha exacta', async () => {
      await actividadRepo.save(actividadRepo.create({
        titulo: 'Concierto Sinfónico',
        fecha: '2025-07-01',
        cupoMaximo: 100,
        estado: 0,
      }));

      const actividades = await service.findActividadesByDate('2025-07-01');
      expect(actividades.length).toBeGreaterThan(0);
      expect(actividades[0].fecha).toBe('2025-07-01');
    });
  });

  describe('cambiarEstado', () => {
    it('debería lanzar error si la actividad no existe', async () => {
      await expect(service.cambiarEstado('no-existe', 1)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar error por estado inválido', async () => {
      const actividad = await actividadRepo.save(actividadRepo.create({
        titulo: 'Obra de teatro experimental',
        fecha: '2025-08-01',
        cupoMaximo: 10,
        estado: 0,
      }));

      await expect(service.cambiarEstado(actividad.id, 99)).rejects.toThrow(BadRequestException);
    });

    it('no debería cerrar la actividad si el cupo no está al 80%', async () => {
      const estudiantes = await estudianteRepo.save(
        Array(6).fill(null).map((_, i) =>
          estudianteRepo.create({
            cedula: 1000 + i,
            nombre: `Estudiante ${i}`,
            correo: `correo${i}@test.com`,
            programa: 'Artes',
            semestre: 3,
          })
        )
      );

      const actividad = await actividadRepo.save(actividadRepo.create({
        titulo: 'Taller de pintura avanzada',
        fecha: '2025-09-01',
        cupoMaximo: 10,
        estado: 0,
        estudiantes,
      }));

      await expect(service.cambiarEstado(actividad.id, 1)).rejects.toThrow(BadRequestException);
    });

    it('no debería finalizar la actividad si aún hay cupo', async () => {
      const estudiantes = await estudianteRepo.save(
        Array(9).fill(null).map((_, i) =>
          estudianteRepo.create({
            cedula: 2000 + i,
            nombre: `Estudiante ${i}`,
            correo: `correo${i}@test.com`,
            programa: 'Literatura',
            semestre: 4,
          })
        )
      );

      const actividad = await actividadRepo.save(actividadRepo.create({
        titulo: 'Feria literaria',
        fecha: '2025-10-01',
        cupoMaximo: 10,
        estado: 0,
        estudiantes,
      }));

      await expect(service.cambiarEstado(actividad.id, 2)).rejects.toThrow(BadRequestException);
    });

    it('debería cerrar la actividad si el cupo está al 80% o más', async () => {
      const estudiantes = await estudianteRepo.save(
        Array(8).fill(null).map((_, i) =>
          estudianteRepo.create({
            cedula: 3000 + i,
            nombre: `Estudiante ${i}`,
            correo: `correo${i}@test.com`,
            programa: 'Cine',
            semestre: 5,
          })
        )
      );

      const actividad = await actividadRepo.save(actividadRepo.create({
        titulo: 'Cine foro internacional',
        fecha: '2025-11-01',
        cupoMaximo: 10,
        estado: 0,
        estudiantes,
      }));

      const resultado = await service.cambiarEstado(actividad.id, 1);
      expect(resultado.estado).toBe(1);
    });

    it('debería finalizar la actividad si está llena', async () => {
      const estudiantes = await estudianteRepo.save(
        Array(10).fill(null).map((_, i) =>
          estudianteRepo.create({
            cedula: 4000 + i,
            nombre: `Estudiante ${i}`,
            correo: `correo${i}@test.com`,
            programa: 'Teatro',
            semestre: 6,
          })
        )
      );

      const actividad = await actividadRepo.save(actividadRepo.create({
        titulo: 'Jornada de cuentería',
        fecha: '2025-12-01',
        cupoMaximo: 10,
        estado: 0,
        estudiantes,
      }));

      const resultado = await service.cambiarEstado(actividad.id, 2);
      expect(resultado.estado).toBe(2);
    });
  });
});
