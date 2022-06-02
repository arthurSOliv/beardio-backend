import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import IUserRepository from '../repositories/IUserRepository';
import IClientRepository from '../repositories/IClientRepository';
import ICompleteUserDTO from '../dtos/ICompleteUserDTO';

import AppError from '@shared/errors/AppError';

interface Request {
    name: string;
    email: string;
    password: string;
    cpf: string;
}

@injectable()
class CreateClientService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('ClientsRepository')
        private clientsRepository: IClientRepository,
    ) {}

    public async execute({ name, email, password, cpf }: Request): Promise<ICompleteUserDTO> {
        const checkClientExists = await this.clientsRepository.findByCpf(cpf);

        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkClientExists) {
            throw new AppError('CPF já usado por outro usuário');
        }

        if (checkUserExists) {
            throw new AppError('Email já usado por outro usuário');
        }

        const hashedPassword = await hash(password, 8);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        });

        const client = await this.clientsRepository.create({
            cpf,
            user_id: user.id,
        });

        const completeUser: ICompleteUserDTO = {
            id: client.id,
            user_id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            cpf: client.cpf,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        return completeUser;
    }
}

export default CreateClientService;