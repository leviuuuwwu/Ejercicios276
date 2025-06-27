import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity/user.entity';
import { Machine } from 'src/machines/machine.entity/machine.entity';
import { machine } from 'os';

@Entity()
export class RentalRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Machine, machine => machine.rentals, { eager: false })
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @ManyToOne(() => User, user => user.rentals, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column({ default: 'pending' })
  status: string;
}
