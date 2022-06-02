import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import ListProviderAppointmentsService from "@modules/appointments/services/ListProviderAppointmentsService";

export default class ProviderAppointmentsController {
    public async list(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { day, month, year } = request.query;

        const listProviderAppointmentsService = container.resolve(ListProviderAppointmentsService);

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: user_id,
            day: Number(day),
            month: Number(month),
            year: Number(year)
        });
        
        return response.json(classToClass(appointments));
    }
}