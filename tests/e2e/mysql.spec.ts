import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ApplicationModule } from '../src/app.module';
import * as request from 'supertest';

describe('Mysql', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`should return created entity`, () => {
    return request(app.getHttpServer())
      .post('/users')
      .expect(201)
      .set('Accept', 'application/json')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
      })
      .expect(({ body }) => {
        expect(body[0]).toEqual({
          fieldCount: 0,
          changedRows: 0,
          affectedRows: 1,
          insertId: body[0].insertId,
          info: '',
          serverStatus: 2,
          warningStatus: 0,
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
