import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/appointmentsRepository";
import { startOfHour } from 'date-fns';

interface Request {
    provider: string;
    date: Date;
}

class CreateAppointmentService {
    private appointmentsRepository: AppointmentsRepository;

    constructor(appointmentsRepository: AppointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }
    
    public execute({ provider, date }: Request): Appointment {
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = this.appointmentsRepository.findByDate(appointmentDate);

        if(findAppointmentInSameDate) {
            throw Error('Esse horário já foi agendado!');
        }

        const appointment = this.appointmentsRepository.create({
            provider,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;