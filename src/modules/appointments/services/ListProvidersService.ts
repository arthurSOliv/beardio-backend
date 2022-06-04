import { injectable, inject } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import IProviderRepository from '@modules/users/repositories/IProviderRepository';
import ICompleteUserDTO from '@modules/users/dtos/ICompleteUserDTO';

import AppError from '@shared/errors/AppError';

@injectable()
class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('ProvidersRepository')
        private providersRepository: IProviderRepository
    ) {}

    public async execute(user_id: string): Promise<ICompleteUserDTO[]> {
        const providers = await this.providersRepository.findAllProvidersJoinUser(user_id);
        
        return providers;
    }

    public async listOne(user_id: string): Promise<ICompleteUserDTO> {
        const provider = await this.providersRepository.findByUserIdJoinUser(user_id);

        if(!provider) {
            throw new AppError('Provider not found.');
        }
        
        return provider;
    }
}

export default ListProvidersService;