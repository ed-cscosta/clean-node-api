import { Encrypter } from '../../data/protocols/encrypter';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements Encrypter {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async encrypt(data: string): Promise<string> {
    return await bcrypt.hash(data, this.salt);
  }
}