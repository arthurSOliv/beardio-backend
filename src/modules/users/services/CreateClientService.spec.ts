import CreateClientService from "./CreateClientService";
import FakeClientsRepository from "../repositories/fakes/FakeClientsRepository";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";

describe('CreateClient', () => {
    it('should be able to create a new client', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeClientsRepository = new FakeClientsRepository();
        const createUserService = new CreateClientService(fakeUsersRepository, fakeClientsRepository);

        const client = await createUserService.execute({cpf: '11111111111', email: 'arthur@test.com', name: 'Arthur', password: '123123'});

        expect(client).toHaveProperty('id');
        expect(client).toHaveProperty('user_id');
        expect(client.cpf).toBe('11111111111');
    });
})