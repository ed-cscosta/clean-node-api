import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  CreateAccount,
} from './signup-protocols';
import { InvalidParamError, MissingParamError } from '../../errors';
import {
  badRequest,
  serverError,
  successRequest,
} from '../../helpers/http-helper';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly createAccount: CreateAccount;

  constructor(emailValidator: EmailValidator, createAccount: CreateAccount) {
    this.emailValidator = emailValidator;
    this.createAccount = createAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.createAccount.create({
        name,
        email,
        password,
      });

      return successRequest(account);
    } catch (error) {
      return serverError();
    }
  }
}
