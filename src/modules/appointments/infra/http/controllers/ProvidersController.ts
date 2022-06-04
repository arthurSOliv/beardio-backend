import { Request, Response } from "express";
import { container } from "tsyringe";

import ListProvidersService from "@modules/appointments/services/ListProvidersService";

export default class ProvidersController {
    public async list(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        const listProvidersService = container.resolve(ListProvidersService);

        const providers = await listProvidersService.execute(user_id);
        
        return response.json(providers);
    }

    public async findById(request: Request, response: Response): Promise<Response> {
        const user_id = request.params.user_id;

        const listProvidersService = container.resolve(ListProvidersService);

        const provider = await listProvidersService.listOne(user_id);
        
        return response.json(provider);
    }
}