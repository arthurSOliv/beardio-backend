import { Request, Response } from "express";
import { container } from "tsyringe";

import CreateClientService from "@modules/users/services/CreateClientService";
import CreateProviderService from "@modules/users/services/CreateProviderService";

export default class UserController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password, cpf, cnpj } = request.body;

        const createClient = container.resolve(CreateClientService);
        const createProvider = container.resolve(CreateProviderService);

        if (cpf) {
            const client = await createClient.execute({
                name,
                email,
                password,
                cpf
            });
            return response.json(client);
        } else {
            const provider = await createProvider.execute({
                name,
                email,
                password,
                cnpj
            });
            
            return response.json(provider);
        }
    }
}