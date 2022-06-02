import { Request, Response } from "express";
import { container } from "tsyringe";

import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";

export default class sessionController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { cpfcnpj, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
        cpf: String(cpfcnpj).length === 11 ? cpfcnpj : null,
        cnpj: String(cpfcnpj).length  !== 11 ? cpfcnpj : null,
        password
    });

    delete user.password;
        
    return response.json({ user, token });
    }
}