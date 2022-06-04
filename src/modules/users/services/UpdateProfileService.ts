import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/IHashProvider/models/IHashProvider';

import AppError from '@shared/errors/AppError';

interface IRequest {
    user_id: string;
    name: string;
    password?: string;
    old_password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({ user_id, name, password, old_password }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if(!user) {
            throw new AppError('Usuário não encontrado.');
        }

        user.name = name;

        if(password && !old_password) {
            throw new AppError('É necessário informar a senha antiga para alterar a senha.');
        }

        if(password && old_password) {
    
            const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

            if(!checkOldPassword) {
                throw new AppError('A senha antiga informada não é válida.');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateProfileService;