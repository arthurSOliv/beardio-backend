import { injectable, inject } from 'tsyringe';

import IUserRepository from '../repositories/IUserRepository';
import IClientRepository from '../repositories/IClientRepository';
import IProviderRepository from '../repositories/IProviderRepository';
import ICompleteUserDTO from '../dtos/ICompleteUserDTO';

import AppError from '@shared/errors/AppError';

@injectable()
class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('ClientsRepository')
        private clientsRepository: IClientRepository,

        @inject('ProvidersRepository')
        private providersRepository: IProviderRepository
    ) {}

    public async execute(user_id: string): Promise<ICompleteUserDTO> {
        const user = await this.usersRepository.findById(user_id);
        
        if(!user) {
            throw new AppError('Usuário não encontrado.');
        }

        const formattedUser = user;
        
        const client = await this.clientsRepository.findByUserId(user_id);

        if(client) {
            const completeUser:ICompleteUserDTO = {
                id: client.id,
                user_id: formattedUser.id,
                email: formattedUser.email,
                name: formattedUser.name,
                cpf: client.cpf,
                avatar: formattedUser.avatar,
            }

            return completeUser;
        }

        const provider = await this.providersRepository.findByUserId(user_id);

        if(provider) {
            const completeUser:ICompleteUserDTO = {
                id: provider.id,
                user_id: user.id,
                email: user.email,
                name: user.name,
                cnpj: provider.cnpj,
                avatar: user.avatar,
            }

            return completeUser;
        }

        throw new AppError('Usuário não encontrado.');
    }
}

export default ShowProfileService;