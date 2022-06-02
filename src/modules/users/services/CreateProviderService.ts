import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import IUserRepository from '../repositories/IUserRepository';
import IProviderRepository from '../repositories/IProviderRepository';
import ICompleteUserDTO from '../dtos/ICompleteUserDTO';

import AppError from '@shared/errors/AppError';

interface Request {
    name: string;
    email: string;
    password: string;
    cnpj: string;
}

@injectable()
class CreateProviderService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('ProvidersRepository')
        private providersRepository: IProviderRepository,
    ) {}

    public async execute({ name, email, password, cnpj }: Request): Promise<ICompleteUserDTO> {
        const checkClientExists = await this.providersRepository.findByCnpj(cnpj);

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

        const client = await this.providersRepository.create({
            cnpj,
            user_id: user.id,
        });

        const completeUser: ICompleteUserDTO = {
            id: client.id,
            user_id: user.id,
            name: user.name,
            email: user.email,
            cnpj: client.cnpj,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        return completeUser;
    }
}

export default CreateProviderService;