import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AsyncOptionsExistingModule } from '../src/async-existing-options.module';
import * as request from 'supertest';

describe('Mysql (async configuration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncOptionsExistingModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`should return created entity`, () => {
    return request(app.getHttpServer())
      .post('/users')
      .expect(HttpStatus.CREATED)
      .set('Accept', 'application/json')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
      })
      .expect(({ body }) => {
        expect(body[0]).toEqual({
          fieldCount: 0,
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
