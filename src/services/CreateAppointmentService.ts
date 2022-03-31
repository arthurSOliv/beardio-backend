import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/appointmentsRepository";

interface Request {
    provider_id: string;
    date: Date;
    client_name: string;
}

class CreateAppointmentService {
    public async execute({ provider_id, date, client_name }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);

        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

        if (findAppointmentInSameDate) {
            throw Error('Esse horário já foi agendado!');
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
            client_name
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;