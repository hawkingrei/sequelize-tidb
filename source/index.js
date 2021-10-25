'use strict';

const _ = require('lodash');
// Ensure the user did not forget to install Sequelize.
try {
    require('sequelize');
} catch (_) {
    throw new Error(
        'Failed to load Sequelize. Have you installed it? Run `npm install sequelize`'
    );
}

const { Sequelize, DataTypes, Model } = require('sequelize');
const QueryGenerator = require('sequelize/lib/dialects/mysql/query-generator');
const AbstractDialect = require('sequelize/lib/dialects/abstract');

const MysqlDialect = require('sequelize/lib/dialects/mysql');
MysqlDialect.prototype.name = 'tidb';

MysqlDialect.prototype.supports = _.merge(
    _.cloneDeep(AbstractDialect.prototype.supports), {
      'VALUES ()': true,
      'LIMIT ON UPDATE': true,
      lock: true,
      forShare: 'LOCK IN SHARE MODE',
      settingIsolationLevelDuringTransaction: false,
      schemas: true,
      inserts: {
        ignoreDuplicates: ' IGNORE',
        updateOnDuplicate: ' ON DUPLICATE KEY UPDATE'
      },
      index: {
        collate: false,
        length: true,
        parser: true,
        type: true,
        using: 1
      },
      constraints: {
        foreignKey: true,
        dropConstraint: false,
        check: false
      },
      indexViaAlter: true,
      indexHints: true,
      NUMERIC: true,
      GEOMETRY: true,
      JSON: true,
      REGEXP: true
    });



//// Done!
Sequelize.supportsTiDB = true;
module.exports = require('sequelize');