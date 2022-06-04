import { getRepository, Repository } from 'typeorm';

import IClientRepository from '@modules/users/repositories/IClientRepository';
import ICreateClientDTO from '@modules/users/dtos/ICreateClientDTO';

import ICompleteUserDTO from '@modules/users/dtos/ICompleteUserDTO';

import Client from '../entities/Client';
import User from '../entities/User';

interface IResponse {
    user: User;
    id: string;
    cpf?: string;
    cnpj?: string;
}
class ClientsRepository implements IClientRepository {
    private ormRepository: Repository<Client>;
    private ormUserRepository: Repository<User>;
    
    constructor() {
        this.ormRepository = getRepository(Client);
        this.ormUserRepository = getRepository(User);
    }

    public async findByCpf(cpf: string): Promise<Client | undefined> {
        const client = await this.ormRepository.findOne({
            where: { cpf },
        });

        return client;
    }

    public async findByUserId(user_id: string): Promise<Client | undefined> {
        const client = await this.ormRepository.findOne({
            where: { user_id },
        });

        return client;
    }

    public async findByCpfJoinUser(cpf: string): Promise<ICompleteUserDTO | undefined> {
        const client: Client | undefined = await this.ormRepository.findOne({ where: { cpf } });
        if(client) {
            const user: User | undefined = await this.ormUserRepository.findOne({ where: { id: client.user_id } });

            if(user) {
                const formattedUser = user;
                const completeUser: ICompleteUserDTO = {
                    id: client.id,
                    user_id: client.user_id,
                    email: formattedUser.email,
                    name: formattedUser.name,
                    cpf: client.cpf,
                    avatar: formattedUser.avatar,
                    password: formattedUser.password,
                }
        
                return completeUser;
            }
        }

        return undefined;
    }

    public async create(clientData: ICreateClientDTO): Promise<Client> {
        const client = await this.ormRepository.create(clientData);

        await this.ormRepository.save(client);

        return client;
    }
}

export default ClientsRepository;