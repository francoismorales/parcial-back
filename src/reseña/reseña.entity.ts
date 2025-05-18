import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class ReseñaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    comentario: string;
    
    @Column()
    calificacion: number;
    
    @Column()
    fecha: string;

    @ManyToOne(() => EstudianteEntity, estudiante => estudiante.reseñas)
    estudiante: EstudianteEntity;

    @ManyToOne(() => ActividadEntity, actividad => actividad.reseñas)
    actividad: ActividadEntity;

}
