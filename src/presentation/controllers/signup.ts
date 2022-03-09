import { CreateAccount } from '../../domain/usecases/create-account';
import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
} from '../protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly createAccount: CreateAccount;

  constructor(emailValidator: EmailValidator, createAccount: CreateAccount) {
    this.emailValidator = emailValidator;
    this.createAccount = createAccount;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
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

      const account = this.createAccount.create({
        name,
        email,
        password,
      });

      return {
        statusCode: 200,
        body: account,
      };
    } catch (error) {
      return serverError();
    }
  }
}
