import { expect } from 'chai';
import * as fs from 'fs';
import { after, before, describe, it } from 'mocha';
import { SequelizeAuto } from '../lib/auto.js';
import buildRelatedTableData from './tabledata.js';
const buildTableData = buildRelatedTableData.buildRelatedTableData;

describe('sequelize-auto writer', function () {
  let td;
  before(async function () {
    td = buildTableData();
    const options = {
      // directory: './models',
      additional: {},
      dialect: 'mysql',
      lang: 'ts',
      caseModel: 'p',
      caseFile: 'l',
      caseProp: 'c',
      singularize: false,
    };
    // we've already done the build and relate steps, so we just need to write
    let auto = new SequelizeAuto(null, null, null, options);
    const tt = auto.generate(td);
    td.text = tt;
    await auto.write(td);
    return td;
  });

  after(function () {});

  describe('should write the data', function () {
    it('has the model files', function () {
      const modelFiles = [
        'customer',
        'order',
        'order_item',
        'other_tag',
        'product',
        'product_tag',
        'related_product',
        'supplier',
        'tag',
      ];
      modelFiles.forEach(function (mf) {
        let has = fs.existsSync('./models/' + mf + '.ts');
        expect(has).to.be.true;
      });
    });

    it('has the init-models file', function () {
      let has = fs.existsSync('./models/init-models.ts');
      expect(has).to.be.true;
    });
  });
});
