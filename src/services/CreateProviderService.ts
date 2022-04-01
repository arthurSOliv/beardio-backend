import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from "../models/User";
import Provider from "../models/Provider";

import AppError from '../errors/AppError';

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
            throw new AppError('CPF já usado por outro usuário');
        }

        if (checkUserExists) {
            throw new AppError('Email já usado por outro usuário');
        }

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword
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