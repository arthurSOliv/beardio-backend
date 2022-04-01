import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from "../models/User";
import Client from "../models/Client";

interface Request {
    name: string;
    email: string;
    password: string;
    cpf: string;
}

interface CompleteUser {
    id: string;
    name: string;
    email: string;
    cpf: string;
    created_at: Date;
    updated_at: Date;
}

class CreateClientService {
    public async execute({ name, email, password, cpf }: Request): Promise<CompleteUser> {
        const usersRepository = getRepository(User);
        const clientsRepository = getRepository(Client);

        const checkClientExists = await clientsRepository.findOne({
            where: { cpf },
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

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword
        });

        await usersRepository.save(user);

        const client = clientsRepository.create({
            cpf,
            user_id: user.id,
        });

        const completeUser: CompleteUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: client.cpf,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        await clientsRepository.save(client);

        return completeUser;
    }
}

export default CreateClientService;