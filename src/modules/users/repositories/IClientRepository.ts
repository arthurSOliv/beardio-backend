import ICreateClientDTO from "../dtos/ICreateClientDTO";
import ICompleteUserDTO from "../dtos/ICompleteUserDTO";
import Client from "../infra/typeorm/entities/Client";

export default interface IClientRepository {
    findByCpf(cpf: string): Promise<Client | undefined>;
    findByUserId(user_id: string): Promise<Client | undefined>;
    findByCpfJoinUser(cpf: string): Promise<ICompleteUserDTO | undefined>;
    create(data: ICreateClientDTO): Promise<Client>;
}