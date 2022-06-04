import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';

import AppError from '../../../shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    appointment_id: string;
}

@injectable()
class FinishAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({ appointment_id }: Request): Promise<Appointment> {
        const appointment = await this.appointmentsRepository.findById(appointment_id);

        if(!appointment) {
            throw new AppError('Agendamento não existe');
        }

        appointment.status = 'finished';

        return this.appointmentsRepository.save(appointment);
    }
}

export default FinishAppointmentService;