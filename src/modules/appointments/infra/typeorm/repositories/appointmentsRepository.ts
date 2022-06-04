import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '../entities/Appointment';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;
    
    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, provider_id },
        });

        return findAppointment;
    }

    public async findById(appointment_id: string): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { id: appointment_id },
        });

        return findAppointment;
    }

    public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(alias => 
                    `to_char(${alias}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            }
        })

        return appointments;
    }

    public async findAllInDayFromProvider({ provider_id, day, month, year }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(alias => 
                    `to_char(${alias}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
            relations: ['client'],
            order: {
                date: "ASC",
            },
        })

        appointments.forEach(appointment => {
            // @ts-expect-error
            delete appointment.client.password;
        })

        return appointments;
    }

    public async findAllInDayFromClient({ provider_id, day, month, year }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                client_id: provider_id,
                date: Raw(alias => 
                    `to_char(${alias}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
            relations: ['client'],
            order: {
                date: "ASC",
            },
        })

        appointments.forEach(appointment => {
            // @ts-expect-error
            delete appointment.client.password;
        })

        return appointments;
    }

    public async create({provider_id, client_id, client_name, date}: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = await this.ormRepository.create({provider_id, client_id, client_name, date});

        this.ormRepository.save(appointment);

        return appointment;
    }

    public async save(appointment: Appointment): Promise<Appointment> {
        this.ormRepository.save(appointment);

        return appointment;
    }

    public async delete(appointment_id: string): Promise<void> {
        this.ormRepository.delete(appointment_id);
    }
}

export default AppointmentsRepository;