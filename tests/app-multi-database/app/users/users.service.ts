import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'mysql2';
import { InjectConnection } from '../../../../lib';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection('db1Connection')
    private dbConnection: Pool,
  ) {}

  public async findAll(): Promise<any> {
    const users = await this.dbConnection.query('SELECT * FROM users');
    const results = Object.assign([{}], users[0]);

    return results;
  }

  public async findOne(id: string): Promise<any> {
    if (!id) {
      throw new BadRequestException();
    }

    const user = await this.dbConnection.query(
      'SELECT * FROM users WHERE id=?',
      [id],
    );

    if (!user) {
      throw new NotFoundException();
    }

    const result = Object.assign([{}], user[0]);

    return result;
  }

  public async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = await this.dbConnection.query(
        'INSERT INTO users (firstName, lastName)  VALUES (?, ?)',
        [createUserDto.firstName, createUserDto.lastName],
      );
      return user;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const { firstName, lastName } = updateUserDto;

      const user = await this.dbConnection.query(
        'UPDATE users SET firstName=?, lastName=? WHERE id=?',
        [firstName, lastName, id],
      );
      return user;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: string): Promise<any> {
    if (!id) {
      throw new BadRequestException();
    }

    const user = await this.dbConnection.query(
      'DELETE FROM users WHERE id=?',
      [id],
    );
    return user;
  }
}
