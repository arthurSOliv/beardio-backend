import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/upload";

import CreateClientService from "../services/CreateClientService";
import CreateProviderService from "../services/CreateProviderService";
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();
const upload = multer(uploadConfig);

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

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    try {
        const updateUserAvatar = new UpdateUserAvatarService();

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file!.filename,
        })

        // @ts-expect-error
        delete user.password;

        return response.json(user);
    } catch (err: any) {
        return response.status(400).json({ error: err.message });
    }
})

export default usersRouter;