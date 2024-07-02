import _ from 'lodash';
import { Sequelize } from 'sequelize';
import { AutoBuilder } from './auto-builder.js';
import { AutoGenerator } from './auto-generator.js';
import { AutoRelater } from './auto-relater.js';
import { AutoWriter } from './auto-writer.js';
import { dialects } from './dialects/dialects.js';
export class SequelizeAuto {
    sequelize;
    options;
    constructor(database, username, password, options) {
        if (options && options.dialect === 'sqlite' && !options.storage && database) {
            options.storage = database;
        }
        if (options && options.dialect === 'mssql') {
            // set defaults for tedious, to silence the warnings
            options.dialectOptions = options.dialectOptions || {};
            options.dialectOptions.options = options.dialectOptions.options || {};
            options.dialectOptions.options.trustServerCertificate = true;
            options.dialectOptions.options.enableArithAbort = true;
            options.dialectOptions.options.validateBulkLoadParameters = true;
        }
        if (database instanceof Sequelize) {
            this.sequelize = database;
        }
        else {
            this.sequelize = new Sequelize(database, username, password, options || {});
        }
        this.options = _.extend({
            spaces: true,
            indentation: 2,
            directory: './models',
            additional: {},
            host: 'localhost',
            port: this.getDefaultPort(options.dialect),
            closeConnectionAutomatically: true,
        }, options || {});
        if (!this.options.directory) {
            this.options.noWrite = true;
        }
    }
    async run() {
        let td = await this.build();
        td = this.relate(td);
        const tt = this.generate(td);
        td.text = tt;
        await this.write(td);
        return td;
    }
    build() {
        const builder = new AutoBuilder(this.sequelize, this.options);
        return builder.build().then((tableData) => {
            if (this.options.closeConnectionAutomatically) {
                return this.sequelize.close().then(() => tableData);
            }
            return tableData;
        });
    }
    relate(td) {
        const relater = new AutoRelater(this.options);
        return relater.buildRelations(td);
    }
    generate(tableData) {
        const dialect = dialects[this.sequelize.getDialect()];
        const generator = new AutoGenerator(tableData, dialect, this.options);
        return generator.generateText();
    }
    write(tableData) {
        const writer = new AutoWriter(tableData, this.options);
        return writer.write();
    }
    getDefaultPort(dialect) {
        switch (dialect) {
            case 'mssql':
                return 1433;
            case 'postgres':
                return 5432;
            default:
                return 3306;
        }
    }
}
export default SequelizeAuto;
