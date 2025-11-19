import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  //Dummy users data
  private users = [
    {
      id: 1,
      username: 'john_doe',
      email: 'john_doe@example.com',
      password: bcrypt.hashSync('password123', 10),
    },
    {
      id: 2,
      username: 'jane_smith',
      email: 'jane_smith@example.com',
      password: bcrypt.hashSync('securepass456', 10),
    },
  ];

  async findByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }
  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
