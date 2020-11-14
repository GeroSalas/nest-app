import { registerAs } from '@nestjs/config';
import Knex from 'knex';

export default registerAs(
  'db',
  () =>
    ({
      test: {
        client: 'sqlite3',
        useNullAsDefault: true,
        debug: true,
        connection: {
          filename: ':memory:',
        },
        migrations: {
          directory: `${__dirname}/migrations`,
        },
        seeds: {
          directory: `${__dirname}/seeds`,
        },
      },
      development: {
        client: 'pg',
        useNullAsDefault: true,
        connection: process.env.DB_URL,
        migrations: {
          directory: `${__dirname}/migrations`,
        },
        seeds: {
          directory: `${__dirname}/seeds`,
        },
      },
    } as Knex.Config),
);
