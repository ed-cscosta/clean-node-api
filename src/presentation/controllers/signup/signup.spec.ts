import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../../errors';
import {
  EmailValidator,
  CreateAccount,
  CreateAccountModel,
  AccountModel,
} from './signup-protocols';
import { SignUpController } from './signup';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  createAccountStub: CreateAccount;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    async create(account: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      };

      return await new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new CreateAccountStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const createAccountStub = makeCreateAccount();
  const sut = new SignUpController(emailValidatorStub, createAccountStub);
  return {
    sut,
    emailValidatorStub,
    createAccountStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'teste@teste.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'teste',
        password: '123456',
        passwordConfirmation: '123456',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'teste',
        email: 'teste@teste.com',
        passwordConfirmation: '123456',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'teste',
        email: 'teste@teste.com',
        password: '123456',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  test('Should return 400 if no password confirmation fails', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'teste',
        email: 'teste@teste.com',
        password: '123456',
        passwordConfirmation: '0000000',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'teste',
        email: 'teste@teste.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'teste',
        email: 'teste@teste.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    };

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('teste@teste.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'teste',
        email: 'teste@teste.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, createAccountStub } = makeSut();

    const addSpy = jest.spyOn(createAccountStub, 'create');

    const httpRequest = {
      body: {
        name: 'teste',
        email: 'teste@teste.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    };

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'teste',
      email: 'teste@teste.com',
      password: '123456',
    });
  });

  test('Should return 500 if CreateAccount throws', async () => {
    const { sut, createAccountStub } = makeSut();

    jest.spyOn(createAccountStub, 'create').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()));
    });

    const httpRequest = {
      body: {
        name: 'teste',
        email: 'teste@teste.com',
        password: '123456',
        passwordConfirmation: '123456',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should return 500 if CreateAccount throws', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    });
  });
});
