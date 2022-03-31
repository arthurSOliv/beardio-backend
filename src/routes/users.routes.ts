import { Router } from "express";

import CreateClientService from "../services/CreateClientService";
import CreateProviderService from "../services/CreateProviderService";

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password, cpf, cnpj } = request.body;

        const createClient = new CreateClientService();
        const createProvider = new CreateProviderService();

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
    } catch (err: any) {
        return response.status(400).json({ error: err.message });
    }
})

export default usersRouter;