import { container } from 'tsyringe';

import IHashProvider from '../providers/IHashProvider/models/IHashProvider';
import BCryptHashProvider from './IHashProvider/implementation/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);