import ResetPasswordService from "./ResetPasswordService";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokenRepository from "../repositories/fakes/FakeUserTokenRepository";
import FakeHashProvider from "../providers/IHashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

describe('ResetPasswordService', () => {
    it('should be able to reset the password', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const fakeUserTokenRepository = new FakeUserTokenRepository();
        const resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokenRepository, fakeHashProvider);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const user = await fakeUsersRepository.create({ email: 'test@test.com', name: 'Arthur', password: '123123' });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        await resetPasswordService.execute({ token: token, password: '123456' });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123456');
        expect(updatedUser?.password).toBe('123456');
    });

    it('should not be able to reset the password with non existing token', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const fakeUserTokenRepository = new FakeUserTokenRepository();
        const resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokenRepository, fakeHashProvider);

        await expect(resetPasswordService.execute({ token: 'non-existing-token', password: '123456' })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const fakeUserTokenRepository = new FakeUserTokenRepository();
        const resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokenRepository, fakeHashProvider);

        const { token } = await fakeUserTokenRepository.generate('non-existing-user');
        
        await expect(resetPasswordService.execute({ token, password: '123456' })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password if passed more than two hours', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const fakeUserTokenRepository = new FakeUserTokenRepository();
        const resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokenRepository, fakeHashProvider);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        const user = await fakeUsersRepository.create({ email: 'test@test.com', name: 'Arthur', password: '123123' });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        expect(resetPasswordService.execute({ token: token, password: '123456' })).rejects.toBeInstanceOf(AppError);
    });
})