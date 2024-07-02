import { Utils } from "sequelize";
export function addTicks(value) {
    return Utils.addTicks(value, "'");
}
export function makeCondition(columnName, value) {
    return value ? ` AND ${columnName} = ${addTicks(value)} ` : "";
}
