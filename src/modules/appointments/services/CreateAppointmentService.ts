import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';

import AppError from '../../../shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    provider_id: string;
    client_id: string;
    date: Date;
    client_name: string;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({ provider_id, client_id, date, client_name }: Request): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        if(isBefore(appointmentDate, Date.now())) {
            throw new AppError("Não é possível agendar em uma data passada.");
        }

        if(provider_id === client_id) {
            throw new AppError("Não é possível agendar um horário consigo mesmo.");
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError("Não é possível agendar um horário fora do horário de funcionamento.");
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

        if (findAppointmentInSameDate) {
            throw new AppError('Esse horário já foi agendado!');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            client_id,
            date: appointmentDate,
            client_name
        });

        return appointment;
    }
}

export default CreateAppointmentService;