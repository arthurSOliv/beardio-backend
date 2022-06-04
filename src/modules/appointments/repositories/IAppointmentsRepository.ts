import Appointment from "../infra/typeorm/entities/Appointment";
import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "../dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "../dtos/IFindAllInDayFromProviderDTO";

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    save(appointment: Appointment): Promise<Appointment>;
    findById(appointment_id: string): Promise<Appointment | undefined>;
    findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
    findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO): Promise<Appointment[]>;
    findAllInDayFromProvider(data: IFindAllInDayFromProviderDTO): Promise<Appointment[]>;
    findAllInDayFromClient(data: IFindAllInDayFromProviderDTO): Promise<Appointment[]>;
    delete(appointment_id: string): Promise<void>;
}