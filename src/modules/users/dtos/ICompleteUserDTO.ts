export default interface ICompleteUserDTO {
    id: string;
    user_id: string;
    email: string;
    name: string;
    cpf?: string;
    cnpj?: string;
    avatar?: string;
    password?: string;
    created_at?: Date;
    updated_at?: Date;
}