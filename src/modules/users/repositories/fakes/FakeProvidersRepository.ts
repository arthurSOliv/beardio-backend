import IProviderRepository from '@modules/users/repositories/IProviderRepository';
import ICreateProviderDTO from '@modules/users/dtos/ICreateProviderDTO';

import ICompleteUserDTO from '@modules/users/dtos/ICompleteUserDTO';

import Provider from '@modules/users/infra/typeorm/entities/Provider';
import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';

class FakeProvidersRepository implements IProviderRepository {
    private users: User[] = [];
    private providers: Provider[] = [];

    public async findByCnpj(cnpj: string): Promise<Provider | undefined> {
        const findProvider = this.providers.find(provider => provider.cnpj === cnpj);

        return findProvider;
    }

    public async findByUserId(user_id: string): Promise<Provider | undefined> {
        const findProvider = this.providers.find(provider => provider.user_id === user_id);

        return findProvider;
    }

    public async findByCnpjJoinUser(cnpj: string): Promise<ICompleteUserDTO | undefined> {
        const findProvider = this.providers.find(provider => provider.cnpj === cnpj);

        let findUser: User | undefined;
        let completeUser: ICompleteUserDTO | undefined = undefined;

        if(findProvider) {
            findUser = this.users.find(user => user.id === findProvider.user_id);

            if(findUser) {
                completeUser = {
                    id: findProvider.id,
                    name: findUser.name,
                    email: findUser.email,
                    password: findUser.password,
                    user_id: findUser.id,
                    cnpj: findProvider.cnpj
                }
            }
        }

        return completeUser;
    }

    public async findByUserIdJoinUser(user_id: string): Promise<ICompleteUserDTO | undefined> {
        const findProvider = this.providers.find(provider => provider.user_id === user_id);

        let findUser: User | undefined;
        let completeUser: ICompleteUserDTO | undefined = undefined;

        if(findProvider) {
            findUser = this.users.find(user => user.id === findProvider.user_id);

            if(findUser) {
                completeUser = {
                    id: findProvider.id,
                    name: findUser.name,
                    email: findUser.email,
                    password: findUser.password,
                    user_id: findUser.id,
                    cnpj: findProvider.cnpj
                }
            }
        }

        return completeUser;
    }

    public async findAllProvidersJoinUser(except_user_id: string): Promise<ICompleteUserDTO[]> {
        let { providers } = this;
        let completeUsers: ICompleteUserDTO[] = [];

        if(except_user_id) {
            providers = this.providers.filter(user => user.id !== except_user_id);
        }

        providers.map(provider => {
            const findUser = this.users.find(user => user.id === provider.user_id);

            if(findUser) {
                completeUsers.push({
                    id: provider.id,
                    name: findUser.name,
                    email: findUser.email,
                    user_id: findUser.id,
                    cnpj: provider.cnpj
                });
            }
        })

        return completeUsers;
    }

    public async create(providerData: ICreateProviderDTO): Promise<Provider> {
        const user = new User();
        user.id = uuid();
        user.email = 'test@test.com';
        user.name ='Test Name';
        user.password = '123123';

        const provider = new Provider();
        provider.id = uuid();
        provider.cnpj = providerData.cnpj;
        provider.user_id = providerData.user_id;

        this.providers.push(provider);

        return provider;
    }
}

export default FakeProvidersRepository;