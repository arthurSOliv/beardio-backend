import { uuid } from 'uuidv4';

import IClientRepository from '@modules/users/repositories/IClientRepository';
import ICreateClientDTO from '@modules/users/dtos/ICreateClientDTO';

import ICompleteUserDTO from '@modules/users/dtos/ICompleteUserDTO';

import Client from '@modules/users/infra/typeorm/entities/Client';
import User from '@modules/users/infra/typeorm/entities/User';

class FakeClientsRepository implements IClientRepository {
    private users: User[] = [];
    private clients: Client[] = [];

    public async findByCpf(cpf: string): Promise<Client | undefined> {
        const findClient = this.clients.find(provider => provider.cpf === cpf);

        return findClient;
    }

    public async findByCpfJoinUser(cpf: string): Promise<ICompleteUserDTO | undefined> {
        const findClient = this.clients.find(client => client.cpf === cpf);

        let findUser: User | undefined;
        let completeUser: ICompleteUserDTO | undefined = undefined;

        if(findClient) {
            findUser = this.users.find(user => user.id === findClient.user_id);

            if(findUser) {
                completeUser = {
                    id: findClient.id,
                    name: findUser.name,
                    email: findUser.email,
                    password: findUser.password,
                    user_id: findUser.id,
                    cpf: findClient.cpf
                }
            }
        }

        return completeUser;
    }

    public async create(clientData: ICreateClientDTO): Promise<Client> {
        const user = new User();
        user.id = uuid();
        user.email = 'test@test.com';
        user.name ='Test Name';
        user.password = '123123';

        const client = new Client();
        client.id = uuid();
        client.cpf = clientData.cpf;
        client.user_id = user.id;

        this.clients.push(client);

        return client;
    }
}

export default FakeClientsRepository;