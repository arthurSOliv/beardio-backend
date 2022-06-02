import UpdateUserAvatarService from "./UpdateUserAvatarService";
import CreateClientService from "./CreateClientService";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeClientsRepository from "../repositories/fakes/FakeClientsRepository";
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from "@shared/errors/AppError";

describe('UpdateUserAvatar', () => {
    it('should be able to update user avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        const user = await fakeUsersRepository.create({ email: 'arthur@test.com', name: 'Arthur', password: '123123' });
        await updateUserAvatarService.execute({user_id: user.id, avatarFilename: 'avatar.jpg'});

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update user avatar with invalid user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        await expect(updateUserAvatarService.execute({user_id: '123123', avatarFilename: 'avatar.jpg'})).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating to a new one', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({ email: 'arthur@test.com', name: 'Arthur', password: '123123' });
        await updateUserAvatarService.execute({user_id: user.id, avatarFilename: 'avatar.jpg'});

        await updateUserAvatarService.execute({user_id: user.id, avatarFilename: 'newAvatar.jpg'});

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('newAvatar.jpg');
        expect(user.avatar).not.toBe('avatar.jpg');
    });
})