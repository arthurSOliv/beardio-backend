import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import Client from "../models/Client";
import Provider from "../models/Provider";

import authConfig from "../config/auth";

interface Request {
    cpf: string;
    cnpj: string;
    password: string;
}

interface CompleteUser {
    id: string;
    email: string;
    name: string;
    cpf?: string;
    cnpj?: string;
}

interface Response {
    user: CompleteUser;
    token: string;
}

class AuthenticateUserService {
    public async execute ({ cpf, cnpj, password }: Request): Promise<Response> {
        const clientsRepository = getRepository(Client);
        const providersRepository = getRepository(Provider);

        let user: any;

        if(cpf) {
            user = await clientsRepository.findOne({ relations: ['user'], where: { cpf } });
        } else {
            user = await providersRepository.findOne({ relations: ['user'], where: { cnpj } });
        }

        if (!user) {
            throw new Error("Incorreta combinação de email/senha.");
        }

        const passwordMatched = await compare(password, user.user.password);

        if (!passwordMatched) {
            throw new Error("Incorreta combinação de email/senha.");
        }

        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn
        });

        const completeUser: CompleteUser = {
            id: user.user_id,
            email: user.user.email,
            name: user.user.name,
            cnpj: user.cnpj,
            cpf: user.cpf,
        }

        return {
            user: completeUser,
            token,
        };
    }
}

export default AuthenticateUserService;