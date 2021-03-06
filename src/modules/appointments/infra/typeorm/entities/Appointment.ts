import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
@Entity('appointments')
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    provider_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'provider_id' })
    provider: User;
    
    @Column()
    client_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'client_id' })
    client: User;

    @Column('timestamp with time zone')
    date: Date;

    @Column()
    client_name?: string;

    @Column('boolean', {default: false})
    status: boolean = false;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Appointment;