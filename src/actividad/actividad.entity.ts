import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { ReseñaEntity } from 'src/reseña/reseña.entity';
import { Column, Entity, OneToMany, ManyToMany,PrimaryGeneratedColumn } from 'typeorm';

export class ActividadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    titulo: string;

    @Column()
    fecha: string;

    @Column()
    cupoMaximo: number;

    @Column()
    estado: number;  

    @ManyToMany(() => EstudianteEntity, estudiante => estudiante.actividades)
    estudiantes: EstudianteEntity[];

    @OneToMany(() => ReseñaEntity, reseña => reseña.actividades)
    reseñas: ReseñaEntity[];

}
