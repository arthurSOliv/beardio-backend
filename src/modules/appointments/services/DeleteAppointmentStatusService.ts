import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';

import AppError from '../../../shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    appointment_id: string;
}

@injectable()
class DeleteAppointmentStatusService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({ appointment_id }: Request): Promise<void> {
        await this.appointmentsRepository.delete(appointment_id);
    }
}

export default DeleteAppointmentStatusService;