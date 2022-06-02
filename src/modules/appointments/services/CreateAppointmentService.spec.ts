import CreateAppointmentService from "./CreateAppointmentService";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import AppError from "@shared/errors/AppError";

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository);

        const appointment = await createAppointmentService.execute({date: new Date(), provider_id: '123123', client_name: 'John Doe'});

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository);

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointmentService.execute({date: appointmentDate, provider_id: '123123', client_name: 'John Doe'});

        await expect(createAppointmentService.execute({date: appointmentDate, provider_id: '123123', client_name: 'John Doe'})).rejects.toBeInstanceOf(AppError);
    });
})