import { Request, Response } from "express";
import { container } from "tsyringe";
import { parseISO } from 'date-fns';

import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";
import ChangeAppointmentStatusService from "@modules/appointments/services/ChangeAppointmentStatusService";
import DeleteAppointmentStatusService from "@modules/appointments/services/DeleteAppointmentStatusService";
export default class AppointmentController {
    public async create(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { provider_id, date, client_name } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = container.resolve(CreateAppointmentService);

        const appointment = await createAppointment.execute({ provider_id, client_id: user_id, date: parsedDate, client_name });
        
        return response.json(appointment);
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const { appointment_id } = request.body;

        const changeAppointmentStatusService = container.resolve(ChangeAppointmentStatusService);

        const appointment = await changeAppointmentStatusService.execute({ appointment_id });
        
        return response.json(appointment);
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        const { appointment_id } = request.body;

        const deleteAppointmentStatusService = container.resolve(DeleteAppointmentStatusService);

        await deleteAppointmentStatusService.execute({ appointment_id });
        
        return response.status(204).json();
    }
}