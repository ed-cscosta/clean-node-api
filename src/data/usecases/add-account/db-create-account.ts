import { AccountModel } from '../../../domain/models/account';
import {
  CreateAccount,
  CreateAccountModel,
} from '../../../domain/usecases/add-account/create-account';
import { Encrypter } from './protocols/encrypter';

export class DbCreateAccount implements CreateAccount {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async create(account: CreateAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    const teste: AccountModel = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    };

    return await new Promise((resolve) => resolve(teste));
  }
}
