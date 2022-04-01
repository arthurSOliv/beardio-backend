import { Router } from "express";

import AuthenticateUserService from "../services/AuthenticateUserService";

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    try {
        const { cpf, cnpj, password } = request.body;

        const authenticateUser = new AuthenticateUserService();

        const { user, token } = await authenticateUser.execute({
            cpf,
            cnpj,
            password
        });

        // @ts-expect-error Aqui vai ocorrer um erro, mas estou ignorando
        delete user.password;
            
        return response.json({ user, token });
    } catch (err: any) {
        return response.status(400).json({ error: err.message });
    }
})

export default sessionsRouter;