import { Router } from "express";

import AuthenticateUserService from "../services/AuthenticateUserService";

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    const { cpfcnpj, password } = request.body;

    const authenticateUser = new AuthenticateUserService();

    const { user, token } = await authenticateUser.execute({
        cpf: String(cpfcnpj).length === 11 ? cpfcnpj : null,
        cnpj: String(cpfcnpj).length  !== 11 ? cpfcnpj : null,
        password
    });

    // @ts-expect-error
    delete user.password;
        
    return response.json({ user, token });
})

export default sessionsRouter;