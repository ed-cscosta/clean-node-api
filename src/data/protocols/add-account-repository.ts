import {
  AccountModel,
  CreateAccountModel,
} from '../usecases/add-account/db-create-account-protocols';

export interface CreateAccountRepository {
  create: (accountData: CreateAccountModel) => Promise<AccountModel>;
}
