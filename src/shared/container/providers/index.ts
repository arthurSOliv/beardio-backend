import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IStorageProvider from "./StorageProvider/models/IStorageProvider";
import DiskStorageProvider from "./StorageProvider/implementations/DiskStorageProvider";

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from './MailProvider/implementations/SesMailProvider';

import IMailsTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>('StorageProvider', DiskStorageProvider);
container.registerSingleton<IMailsTemplateProvider>('MailTemplateProvider', HandlebarsMailTemplateProvider);
console.log(mailConfig.driver);
container.registerInstance<IMailProvider>('MailProvider', mailConfig.driver === 'ethereal' ? container.resolve(EtherealMailProvider) : container.resolve(SESMailProvider));