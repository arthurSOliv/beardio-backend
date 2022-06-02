import UpdateProfileService from "./UpdateProfileService";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/IHashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

describe('UpdateProfile', () => {
    it('should be able to update profile', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);

        const user = await fakeUsersRepository.create({ email: 'arthur@test.com', name: 'Arthur', password: '123123' });
        const updatedUser = await updateProfileService.execute({user_id: user.id, name: 'Arthur Oliveira', password: '123456789', old_password: '123123'});

        expect(updatedUser.name).toBe('Arthur Oliveira');
        expect(updatedUser.password).toBe('123456789');
    });
})