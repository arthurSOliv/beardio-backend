import ICreateProviderDTO from "../dtos/ICreateProviderDTO";
import ICompleteUserDTO from "../dtos/ICompleteUserDTO";
import Provider from "../infra/typeorm/entities/Provider";

export default interface IProviderRepository {
    findByCnpj(cnpj: string): Promise<Provider | undefined>;
    findByUserId(user_id: string): Promise<Provider | undefined>;
    findByCnpjJoinUser(cnpj: string): Promise<ICompleteUserDTO | undefined>;
    findAllProvidersJoinUser(except_user_id?: string): Promise<ICompleteUserDTO[]>;
    create(data: ICreateProviderDTO): Promise<Provider>;
}