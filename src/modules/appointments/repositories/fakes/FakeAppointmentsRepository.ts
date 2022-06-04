import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment => isEqual(appointment.date, date) && appointment.provider_id === provider_id);

        return findAppointment;
    }

    public async findById(appointment_id: string): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment => appointment.id === appointment_id);

        return findAppointment;
    }

    public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            appointment.provider_id === provider_id &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year;
        });

        return appointments;
    }

    public async findAllInDayFromProvider({ provider_id, day, month, year }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            appointment.provider_id === provider_id &&
            getDate(appointment.date) + 1 === day &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year;
        });

        return appointments;
    }

    public async findAllInDayFromClient({ provider_id, day, month, year }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            appointment.provider_id === provider_id &&
            getDate(appointment.date) + 1 === day &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year;
        });

        return appointments;
    }

    public async create({provider_id, client_id, client_name, date}: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        appointment.id = uuid();
        appointment.client_id = client_id;
        appointment.client_name = client_name;
        appointment.date = date;
        appointment.provider_id = provider_id;

        this.appointments.push(appointment);

        return appointment;
    }

    public async save(appointment: Appointment): Promise<Appointment> {
        const findAppointmentIndex = this.appointments.findIndex(findAppointment => findAppointment.id === appointment.id);

        this.appointments[findAppointmentIndex] = appointment;

        return appointment;
    }

    public async delete(appointment_id: string): Promise<void> {
        const findAppointmentIndex = this.appointments.findIndex(findAppointment => findAppointment.id === appointment_id);

        this.appointments.splice(findAppointmentIndex, 1);
    }
}

export default FakeAppointmentsRepository;