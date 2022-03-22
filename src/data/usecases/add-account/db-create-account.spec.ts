import { DbCreateAccount } from './db-create-account';
import {
  AccountModel,
  CreateAccountModel,
  CreateAccountRepository,
  Encrypter,
} from './db-create-account-protocols';

interface SutTypes {
  sut: DbCreateAccount;
  encrypterStub: Encrypter;
  createAccountStub: CreateAccountRepository;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'));
    }
  }

  return new EncrypterStub();
};

const makeAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create(accountData: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
      };
      return await new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new CreateAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const createAccountStub = makeAccountRepository();
  const sut = new DbCreateAccount(encrypterStub, createAccountStub);
  return { sut, encrypterStub, createAccountStub };
};

describe('DbCreateAccount', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await sut.create(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    const promise = sut.create(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('Should call CreateAccountRepository with correct values', async () => {
    const { sut, createAccountStub } = makeSut();
    const createSpy = jest.spyOn(createAccountStub, 'create');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await sut.create(accountData);
    expect(createSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });
});
