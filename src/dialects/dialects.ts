import { Dialect as SeqDialects } from 'sequelize';
import { DialectOptions } from './dialect-options.js';
import { mssqlOptions } from './mssql.js';
import { mysqlOptions } from './mysql.js';
import { postgresOptions } from './postgres.js';
import { sqliteOptions } from './sqlite.js';
export type Dialect = Exclude<SeqDialects, 'db2' | 'snowflake' | 'oracle'>;
export const dialects: { [name in Dialect]: DialectOptions } = {
  mssql: mssqlOptions,
  mysql: mysqlOptions,
  mariadb: mysqlOptions,
  postgres: postgresOptions,
  sqlite: sqliteOptions,
};
