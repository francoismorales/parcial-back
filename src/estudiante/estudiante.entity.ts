import { ActividadEntity } from '../actividad/actividad.entity';
import { ReseñaEntity } from '../reseña/reseña.entity';
import { Column, Entity, OneToMany, ManyToMany,PrimaryGeneratedColumn,JoinTable } from 'typeorm';

@Entity()
export class EstudianteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cedula: number;

    @Column()
    nombre: string;

    @Column()
    correo: string;

    @Column()
    programa: string;  

    @Column()
    semestre: number;

    @OneToMany(() => ReseñaEntity, reseña => reseña.estudiante)
    reseñas: ReseñaEntity[];

    @ManyToMany(() => ActividadEntity, actividad => actividad.estudiantes)
    @JoinTable()
    actividades: ActividadEntity[];

}
 