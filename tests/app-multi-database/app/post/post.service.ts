import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Pool } from 'mysql2';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectConnection } from '../../../../lib';

@Injectable()
export class PostService {
  constructor(
    @InjectConnection('db2Connection')
    private dbConnection: Pool,
  ) {}

  public async findAll(): Promise<any> {
    const posts = await this.dbConnection.query('SELECT * FROM posts');
    const results = Object.assign([{}], posts[0]);

    return results;
  }

  public async findOne(id: string): Promise<any> {
    if (!id) {
      throw new BadRequestException();
    }

    const post = await this.dbConnection.query(
      'SELECT * FROM posts WHERE id=?',
      [id],
    );

    if (!post) {
      throw new NotFoundException();
    }

    const result = Object.assign([{}], post[0]);

    return result;
  }

  public async create(createPostDto: CreatePostDto): Promise<any> {
    try {
      const post = await this.dbConnection.query(
        'INSERT INTO posts (title, description)  VALUES (?, ?)',
        [createPostDto.title, createPostDto.description],
      );
      return post;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateUserDto: UpdatePostDto): Promise<any> {
    try {
      const { title, description } = updateUserDto;

      const posts = await this.dbConnection.query(
        'UPDATE posts SET title=?, descriptions=? WHERE id=?',
        [title, description, id],
      );
      return posts;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: string): Promise<any> {
    if (!id) {
      throw new BadRequestException();
    }

    const post = await this.dbConnection.query('DELETE FROM posts WHERE id=?', [
      id,
    ]);
    return post;
  }
}
