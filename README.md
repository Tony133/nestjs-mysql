<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

MySQL module for Nest framework (node.js) 😻

## Installation

First install the module via `yarn` or `npm` and do not forget to install the driver package as well:


```bash
    $ npm i --save nest-mysql mysql2
```
or

```bash
    $ yarn add nest-mysql mysql2
```

## Table of Contents

- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Usage](#usage)
  - [MySqlModule](#mysqlmodule)
  - [MultiConnectionsDatabase](#multi-connections-database)
  - [ExampleOfUse](#example-of-use)

## Usage

### MySqlModule

MySqlModule is the primary entry point for this package and can be used synchronously

```typescript
@Module({
  imports: [
    MySqlModule.forRoot({
        host: 'localhost',
        database: 'test2',
        password: 'root',
        user: 'root',
        port: 3306,      
    }),
  ],
})
```

or asynchronously

```typescript
@Module({
  imports: [
    MySqlModule.forRootAsync({
      useFactory: () => ({
        host: 'localhost',
        database: 'test',
        password: 'root',
        user: 'root',
        port: 3306,      
      }),
    }),
  ],
})
```

## Example of use

UsersService:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectClient } from 'nest-mysql';
import { Connection } from 'mysql2';

@Injectable()
export class UsersService {
  constructor(@InjectClient() private readonly connection: Connection) {}

  async findAll() {
    const users = await this.connection.query('SELECT * FROM users');
    const results = Object.assign([{}], users[0]);

    return results;
  }
}
```

UsersController:

```typescript
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return await this.usersService.findAll();
  }
}
```

## Multi Connections Database

```typescript
@Module({
  imports: [
    MySqlModule.forRootAsync(
      {
        useFactory: () => ({
          host: 'localhost',
          database: 'test1',
          password: 'root',
          user: 'root',
          port: 3306,      
        }),
      },
      'db1Connection',
    ),
    MySqlModule.forRootAsync(
      {
        useFactory: () => ({
          host: 'localhost',
          database: 'test2',
          password: 'root',
          user: 'root',
          port: 3307,      
        }),
      },
      'db2Connection',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

Usage example with Multi Connection

PostService:

```typescript
import { Pool } from 'mysql2';
import { InjectConnection } from 'nest-mysql';
import { CreatePostDto } from './dto/create-post.dto';

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

  public async create(createPostDto: CreatePostDto): Promise<any> {
    try {
      const post = await this.dbConnection.query(
        'INSERT INTO posts (title, description) VALUES (?, ?)',
        [createPostDto.title, createPostDto.description],
      );
      return post;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
```

UsersService:

```typescript
import { Pool } from 'mysql2';
import { InjectConnection } from 'nest-mysql';
import { CreateUserDto } from './dto/create-user.dto';

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
}
```

For more information on `node-mysql` see [here](https://github.com/sidorares/node-mysql2)

## Contribute
Feel free to help this library, I'm quite busy with also another Nestjs packages, but the community will appreciate the effort of improving this library. Make sure you follow the guidelines

## Stay in touch

- Author - [Tony133](https://github.com/Tony133)
- Framework - [https://nestjs.com](https://nestjs.com/)

## License

 [MIT licensed](LICENSE)
