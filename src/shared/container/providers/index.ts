import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import uploadConfig from '@config/upload';

import IStorageProvider from "./StorageProvider/models/IStorageProvider";
import DiskStorageProvider from "./StorageProvider/implementations/DiskStorageProvider";
import S3StorageProvider from './StorageProvider/implementations/S3StorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from './MailProvider/implementations/SESMailProvider';

import IMailsTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

const storageProviders = {
    disk: DiskStorageProvider,
    s3: S3StorageProvider,
}

container.registerSingleton<IStorageProvider>('StorageProvider', storageProviders[uploadConfig.driver]);
container.registerSingleton<IMailsTemplateProvider>('MailTemplateProvider', HandlebarsMailTemplateProvider);
container.registerInstance<IMailProvider>('MailProvider', mailConfig.driver === 'ethereal' ? container.resolve(EtherealMailProvider) : container.resolve(SESMailProvider));