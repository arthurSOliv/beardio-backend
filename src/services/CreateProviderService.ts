import { getRepository } from 'typeorm';

import User from "../models/User";
import Provider from "../models/Provider";

interface Request {
    name: string;
    email: string;
    password: string;
    cnpj: string;
}

interface CompleteUser {
    id: string;
    name: string;
    email: string;
    cnpj: string;
    created_at: Date;
    updated_at: Date;
}

class CreateProviderService {
    public async execute({ name, email, password, cnpj }: Request): Promise<CompleteUser> {
        const usersRepository = getRepository(User);
        const providersRepository = getRepository(Provider);

        const checkClientExists = await providersRepository.findOne({
            where: { cnpj },
        });

        const checkUserExists = await usersRepository.findOne({
            where: { email },
        });

        if (checkClientExists) {
            throw new Error('CPF já usado por outro usuário');
        }

        if (checkUserExists) {
            throw new Error('Email já usado por outro usuário');
        }

        const user = usersRepository.create({
            name,
            email,
            password
        });

        await usersRepository.save(user);

        const client = providersRepository.create({
            cnpj,
            user_id: user.id,
        });

        const completeUser: CompleteUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            cnpj: client.cnpj,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        await providersRepository.save(client);

        return completeUser;
    }
}

export default CreateProviderService;