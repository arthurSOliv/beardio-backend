import { getRepository, Repository } from 'typeorm';

import IClientRepository from '@modules/users/repositories/IClientRepository';
import ICreateClientDTO from '@modules/users/dtos/ICreateClientDTO';

import ICompleteUserDTO from '@modules/users/dtos/ICompleteUserDTO';

import Client from '../entities/Client';

class ClientsRepository implements IClientRepository {
    private ormRepository: Repository<Client>;
    
    constructor() {
        this.ormRepository = getRepository(Client);
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
        const client: any = await this.ormRepository.findOne({ relations: ['user'], where: { cpf } });

        const completeUser: ICompleteUserDTO = {
            id: client.id,
            user_id: client.user_id,
            email: client.user.email,
            name: client.user.name,
            cpf: client.cpf,
            cnpj: client.cnpj,
            avatar: client.user.avatar,
            password: client.user.password,
        }

        return completeUser;
    }

    public async create(clientData: ICreateClientDTO): Promise<Client> {
        const client = await this.ormRepository.create(clientData);

        await this.ormRepository.save(client);

        return client;
    }
}

export default ClientsRepository;