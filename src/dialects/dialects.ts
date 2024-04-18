import { Dialect } from 'sequelize';
import { DialectOptions } from './dialect-options';
import { mssqlOptions } from './mssql';
import { mysqlOptions } from './mysql';
import { postgresOptions } from './postgres';
import { sqliteOptions } from './sqlite';

export const dialects: { [name in Dialect]: DialectOptions } = {
  mssql: mssqlOptions,
  mysql: mysqlOptions,
  mariadb: mysqlOptions,
  postgres: postgresOptions,
  sqlite: sqliteOptions,
};
