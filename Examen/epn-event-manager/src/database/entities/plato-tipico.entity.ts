import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('platos_tipicos')
export class PlatoTipicoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column()
  region: string;

  @Column({ type: 'text' })
  ingredientes: string;

  @Column({ type: 'real' })
  precio: number;

  @Column()
  imagenUrl: string;

  @Column()
  categoria: string;
}
