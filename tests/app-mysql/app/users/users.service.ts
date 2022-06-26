import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectClient } from '../../../../lib';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { Connection } from 'mysql2';

@Injectable()
export class UsersService {
  constructor(@InjectClient() private readonly connection: Connection) {}

  public async findAll(): Promise<User> {
    const users = await this.connection.query('SELECT * FROM users');
    const results = Object.assign([{}], users[0]);

    return results;
  }

  public async findOne(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException();
    }

    const user = await this.connection.query('SELECT * FROM users WHERE id=?', [
      id,
    ]);

    if (!user) {
      throw new NotFoundException();
    }
    const result = Object.assign([{}], user[0]);

    return result;
  }

  public async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { firstName, lastName } = createUserDto;
      const user = await this.connection.query(
        'INSERT INTO users (firstName, lastName)  VALUES (?, ?)',
        [firstName, lastName],
      );
      return user;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const { firstName, lastName } = updateUserDto;

      const users = await this.connection.query(
        'UPDATE users SET firstName=?, lastName=? WHERE id=?',
        [firstName, lastName, id],
      );
      return users;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: string): Promise<any> {
    if (!id) {
      throw new BadRequestException();
    }

    const users = await this.connection.query('DELETE FROM users WHERE id=?', [
      id,
    ]);
    return users;
  }
}
