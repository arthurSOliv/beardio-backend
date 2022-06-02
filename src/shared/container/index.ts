import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/appointmentsRepository';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IClientRepository from '@modules/users/repositories/IClientRepository';
import ClientsRepository from '@modules/users/infra/typeorm/repositories/ClientsRepository';
import IProviderRepository from '@modules/users/repositories/IProviderRepository';
import ProvidersRepository from '@modules/users/infra/typeorm/repositories/ProvidersRepository';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository', AppointmentsRepository);
container.registerSingleton<IUserRepository>('UsersRepository', UsersRepository);
container.registerSingleton<IClientRepository>('ClientsRepository', ClientsRepository);
container.registerSingleton<IProviderRepository>('ProvidersRepository', ProvidersRepository);
container.registerSingleton<IUserTokenRepository>('UserTokenRepository', UserTokensRepository);