import { HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersModule } from '../src/apps/app-mysql/app/users/users.module';
import { AppModule } from '../src/apps/app-mysql/app/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

describe('[Feature] User - /user', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('should create a new user [POST /users]', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Accept', 'application/json')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
      })
      .then(({ body }) => {
        expect(body[0]).toEqual({
          fieldCount: 0,
          changedRows: 0,
          affectedRows: 1,
          insertId: 1,
          info: '',
          serverStatus: 2,
          warningStatus: 0,
        });
        expect(HttpStatus.CREATED);
      });
  });

  it('should get all users [GET /users]', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK)
      .set('Accept', 'application/json')
      .then(({ body }) => {
        expect(body).toEqual([
          {
            id: 1,
            firstName: 'firstName',
            lastName: 'lastName',
          },
        ]);
      });
  });

  it('should get a user [GET /users/:id]', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(HttpStatus.OK)
      .set('Accept', 'application/json')
      .then(({ body }) => {
        expect(body).toEqual([
          {
            id: 1,
            firstName: 'firstName',
            lastName: 'lastName',
          },
        ]);
      });
  });

  it('should update a user [PUT /users/:id]', () => {
    return request(app.getHttpServer())
      .put('/users/1')
      .expect(HttpStatus.OK)
      .send({
        firstName: 'firstName update',
        lastName: 'lastName update',
      })
      .then(({ body }) => {
        expect(body[0]).toEqual({
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          info: 'Rows matched: 1  Changed: 1  Warnings: 0',
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 1,
        });
      });
  });

  it('should delete a user by id [DELETE /users/:id]', () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
