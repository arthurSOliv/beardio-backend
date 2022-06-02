import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import IClientRepository from '../repositories/IClientRepository';
import IProviderRepository from '../repositories/IProviderRepository';

import ICompleteUserDTO from '../dtos/ICompleteUserDTO';

import authConfig from "@config/auth";

import AppError from "@shared/errors/AppError";

interface Request {
    cpf: string;
    cnpj: string;
    password: string;
}

interface Response {
    user: ICompleteUserDTO;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('ClientsRepository')
        private clientsRepository: IClientRepository,

        @inject('ProvidersRepository')
        private providersRepository: IProviderRepository,
    ) {}
    
    public async execute ({ cpf, cnpj, password }: Request): Promise<Response> {
        let user: any;

        if(cpf) {
            user = await this.clientsRepository.findByCpfJoinUser(cpf);
        } else {
            user = await this.providersRepository.findByCnpjJoinUser(cnpj);
        }

        if (!user) {
            throw new AppError("Incorreta combinação de email/senha.", 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError("Incorreta combinação de email/senha.", 401);
        }

        const token = sign({}, authConfig.jwt.secret as string, {
            subject: user.user_id,
            expiresIn: authConfig.jwt.expiresIn
        });

        const completeUser: ICompleteUserDTO = {
            id: user.id,
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            cnpj: user.cnpj,
            cpf: user.cpf,
            avatar: user.avatar,
        }

        return {
            user: completeUser,
            token,
        };
    }
}

export default AuthenticateUserService;