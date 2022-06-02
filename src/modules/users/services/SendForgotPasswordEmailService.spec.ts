import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUserTokenRepository from "../repositories/fakes/FakeUserTokenRepository";
import AppError from "@shared/errors/AppError";

describe('SendForgotPasswordEmail', () => {
    it('should be able to recover the password using the email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeMailProvider = new FakeMailProvider();
        const fakeUserTokenRepository = new FakeUserTokenRepository();
        const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokenRepository);

        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({ email: 'test@test.com', name: 'Arthur', password: '123123' });

        await sendForgotPasswordEmailService.execute({ email: 'test@test.com' });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover the password of non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeMailProvider = new FakeMailProvider();
        const fakeUserTokenRepository = new FakeUserTokenRepository();
        const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokenRepository);

        await expect(sendForgotPasswordEmailService.execute({ email: 'test@test.com' })).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a new forgot password token', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeMailProvider = new FakeMailProvider();
        const fakeUserTokenRepository = new FakeUserTokenRepository();
        const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokenRepository);

        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUsersRepository.create({ email: 'test@test.com', name: 'Arthur', password: '123123' });

        await sendForgotPasswordEmailService.execute({ email: 'test@test.com' });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
})