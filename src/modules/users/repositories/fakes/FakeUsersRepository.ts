import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';

class FakeUsersRepository implements IUserRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.id === id);

        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email === email);

        return findUser;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();
        user.id = uuid();
        user.email = userData.email;
        user.name = userData.name;
        user.password = userData.password;

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

        this.users[findIndex] = user;

        return user;
    }
}

export default FakeUsersRepository;