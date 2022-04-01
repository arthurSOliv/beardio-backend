import { Router } from "express";

import AuthenticateUserService from "../services/AuthenticateUserService";

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    const { cpf, cnpj, password } = request.body;

    const authenticateUser = new AuthenticateUserService();

    const { user, token } = await authenticateUser.execute({
        cpf,
        cnpj,
        password
    });

    // @ts-expect-error
    delete user.password;
        
    return response.json({ user, token });
})

export default sessionsRouter;