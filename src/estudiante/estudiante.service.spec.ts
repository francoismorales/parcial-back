/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from './../actividad/actividad.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepo: Repository<EstudianteEntity>;
  let actividadRepo: Repository<ActividadEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepo = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    actividadRepo = module.get<Repository<ActividadEntity>>(getRepositoryToken(ActividadEntity));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('crearEstudiante', () => {
    it('debería lanzar error si el correo es inválido', async () => {
      const estudiante = estudianteRepo.create({
        cedula: 12345,
        nombre: 'Pepito',
        correo: 'correo-invalido',
        programa: 'Sistemas',
        semestre: 5,
      });

      await expect(service.crearEstudiante(estudiante)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar error si el semestre está fuera de rango', async () => {
      const estudiante = estudianteRepo.create({
        cedula: 12345,
        nombre: 'Pepito',
        correo: 'pepito@gmail.com',
        programa: 'Sistemas',
        semestre: 11,
      });

      await expect(service.crearEstudiante(estudiante)).rejects.toThrow(BadRequestException);
    });

    it('debería crear un estudiante válido', async () => {
      const estudiante = estudianteRepo.create({
        cedula: 12345,
        nombre: 'Pepito',
        correo: 'pepito@mail.com',
        programa: 'Sistemas',
        semestre: 6,
      });

      const resultado = await service.crearEstudiante(estudiante);
      expect(resultado).toBeDefined();
      expect(resultado.id).toBeDefined();
      expect(resultado.correo).toEqual('pepito@mail.com');
    });
  });

  describe('findEstudianteById', () => {
    it('debería lanzar error si el estudiante no existe', async () => {
      await expect(service.findEstudianteById('no-existe')).rejects.toThrow(NotFoundException);
    });

    it('debería retornar el estudiante si existe', async () => {
      const estudiante = await estudianteRepo.save(estudianteRepo.create({
        cedula: 12345,
        nombre: 'Pepito',
        correo: 'pepito@mail.com',
        programa: 'Sistemas',
        semestre: 6,
      }));

      const resultado = await service.findEstudianteById(estudiante.id);
      expect(resultado).toBeDefined();
      expect(resultado.nombre).toEqual('Pepito');
    });
  });
});
