import { getRepository, Repository, Not } from 'typeorm';

import IProviderRepository from '@modules/users/repositories/IProviderRepository';
import ICreateProviderDTO from '@modules/users/dtos/ICreateProviderDTO';

import ICompleteUserDTO from '@modules/users/dtos/ICompleteUserDTO';

import Provider from '../entities/Provider';
import User from '../entities/User';

class ProvidersRepository implements IProviderRepository {
    private ormRepository: Repository<Provider>;
    private ormUserRepository: Repository<User>;
    
    constructor() {
        this.ormRepository = getRepository(Provider);
        this.ormUserRepository = getRepository(User);
    }

    public async findByCnpj(cnpj: string): Promise<Provider | undefined> {
        const provider = await this.ormRepository.findOne({
            where: { cnpj },
        });

        return provider;
    }

    public async findByUserId(user_id: string): Promise<Provider | undefined> {
        const provider = await this.ormRepository.findOne({
            where: { user_id },
        });

        return provider;
    }

    public async findByCnpjJoinUser(cpf: string): Promise<ICompleteUserDTO | undefined> {
        const provider: any = await this.ormRepository.findOne({  where: { cpf } });
        if(provider) {
            const user: User | undefined = await this.ormUserRepository.findOne({ where: { id: provider.user_id } });

            if(user) {
                const formattedUser = user;
                const completeUser: ICompleteUserDTO = {
                    id: provider.id,
                    user_id: provider.user_id,
                    email: formattedUser.email,
                    name: formattedUser.name,
                    cnpj: provider.cnpj,
                    avatar: formattedUser.avatar,
                    password: formattedUser.password,
                }
        
                return completeUser;
            }
        }

        return undefined;
    }

    public async findByUserIdJoinUser(user_id: string): Promise<ICompleteUserDTO | undefined> {
        const provider: any = await this.ormRepository.findOne({  where: { user_id } });
        if(provider) {
            const user: User | undefined = await this.ormUserRepository.findOne({ where: { id: provider.user_id } });

            if(user) {
                const formattedUser = user;
                const completeUser: ICompleteUserDTO = {
                    id: provider.id,
                    user_id: provider.user_id,
                    email: formattedUser.email,
                    name: formattedUser.name,
                    cnpj: provider.cnpj,
                    avatar: formattedUser.avatar,
                    password: formattedUser.password,
                }
        
                return completeUser;
            }
        }

        return undefined;
    }

    public async findAllProvidersJoinUser(except_user_id?: string): Promise<ICompleteUserDTO[]> {
        let providers: any[] = [];
        let completeProviders: ICompleteUserDTO[] = [];

        if (except_user_id) {
            providers = await this.ormRepository.find({ relations: ['user'], where: { user: { id: Not(except_user_id) } } });
        } else {
            providers = await this.ormRepository.find({ relations: ['user'] });
        }

        providers.map(provider => {
            const providerComplete: ICompleteUserDTO = {
                id: provider.id,
                user_id: provider.user_id,
                email: provider.user.email,
                name: provider.user.name,
                cnpj: provider.cnpj,
                avatar: provider.user.avatar,
            }

            completeProviders.push(providerComplete);
        });

        return completeProviders;
    }

    public async create(providerData: ICreateProviderDTO): Promise<Provider> {
        const provider = await this.ormRepository.create(providerData);

        await this.ormRepository.save(provider);

        return provider;
    }
}

export default ProvidersRepository;