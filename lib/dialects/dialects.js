import { mssqlOptions } from './mssql.js';
import { mysqlOptions } from './mysql.js';
import { postgresOptions } from './postgres.js';
import { sqliteOptions } from './sqlite.js';
export const dialects = {
    mssql: mssqlOptions,
    mysql: mysqlOptions,
    mariadb: mysqlOptions,
    postgres: postgresOptions,
    sqlite: sqliteOptions,
};
