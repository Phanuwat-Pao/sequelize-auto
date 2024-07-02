import _ from 'lodash';
import { check as isReserved } from 'reserved-words';
import { Utils } from 'sequelize';
export class TableData {
    /** Fields for each table; indexed by schemaName.tableName */
    tables;
    /** Foreign keys for each table; indexed by schemaName.tableName */
    foreignKeys;
    /** Flag `true` for each table that has any trigger.  This affects how Sequelize performs updates. */
    hasTriggerTables;
    /** Indexes for each table; indexed by schemaName.tableName */
    indexes;
    /** Relations between models, computed from foreign keys */
    relations;
    /** Text to be written to the model files, indexed by schemaName.tableName */
    text;
    constructor() {
        this.tables = {};
        this.foreignKeys = {};
        this.indexes = {};
        this.hasTriggerTables = {};
        this.relations = [];
    }
}
/** Split schema.table into [schema, table] */
export function qNameSplit(qname) {
    if (qname.indexOf('.') > 0) {
        const [schemaName, tableNameOrig] = qname.split('.');
        return [schemaName, tableNameOrig];
    }
    return [null, qname];
}
/** Get combined schema.table name */
export function qNameJoin(schema, table) {
    return !!schema ? schema + '.' + table : table;
}
/** Uses Inflector via Sequelize, but appends 's' if plural would be the same as singular.
 * Use `Utils.useInflection({ singularize: fn, pluralize: fn2 })` to configure. */
export function pluralize(s) {
    let p = Utils.pluralize(s);
    if (p === Utils.singularize(s)) {
        p += 's';
    }
    return p;
}
/** Uses Inflector via Sequelize.  Use `Utils.useInflection({ singularize: fn, pluralize: fn2 })` to configure. */
export function singularize(s) {
    return Utils.singularize(s);
}
/** Change casing of val string according to opt [c|l|o|p|u]  */
export function recase(opt, val, singular = false) {
    if (singular && val) {
        val = singularize(val);
    }
    if (!opt || opt === 'o' || !val) {
        return val || ''; // original
    }
    if (opt === 'c') {
        return _.camelCase(val);
    }
    if (opt === 'k') {
        return _.kebabCase(val);
    }
    if (opt === 'l') {
        return _.snakeCase(val);
    }
    if (opt === 'p') {
        return _.upperFirst(_.camelCase(val));
    }
    if (opt === 'u') {
        return _.snakeCase(val).toUpperCase();
    }
    return val;
}
const tsNames = ['DataTypes', 'Model', 'Optional', 'Sequelize'];
export function makeTableName(opt, tableNameOrig, singular = false, lang = 'es5') {
    let name = recase(opt, tableNameOrig, singular);
    if (isReserved(name) || (lang == 'ts' && tsNames.includes(name))) {
        name += '_';
    }
    return name;
}
/** build the array of indentation strings */
export function makeIndent(spaces, indent) {
    let sp = '';
    for (let x = 0; x < (indent || 2); ++x) {
        sp += spaces === true ? ' ' : '\t';
    }
    let space = [];
    for (let i = 0; i < 6; i++) {
        space[i] = sp.repeat(i);
    }
    return space;
}
