
const chai = require('chai');
const Sequelize = require('../source');

chai.use(require('chai-as-promised'));
chai.use(require('chai-datetime'));
chai.use(require('sinon-chai'));

// These tests run against a local instance of CockroachDB that meets the
// following requirements:
//
// 1. Running with the --insecure flag.
// 2. Contains a database named "sequelize_test".

// To override the CockroachDB port, set the COCKROACH_PORT environment
// variable.

async function cleanupDatabase(sequelize) {
  // https://github.com/sequelize/sequelize/blob/29901187d9560e7d51ae1f9b5f411cf0c5d8994a/test/support.js#L136
  const qi = sequelize.getQueryInterface();
  await qi.dropAllTables();
  
  sequelize.modelManager.models = [];
  sequelize.models = {};
  if (qi.dropAllEnums) {
    await qi.dropAllEnums();
  }
}

before(function () {
  this.sequelize = makeTestSequelizeInstance();
});

afterEach(async function () {
  await cleanupDatabase(this.sequelize);
});

after(async function () {
  await this.sequelize.close();
});

function makeTestSequelizeInstance() {
  return new Sequelize('sequelize_test', 'root', '', {
    dialect: 'mariadb',
    port: 4000,
    logging: false,
    typeValidation: true,
    dialectOptions: {cockroachdbTelemetryDisabled : true},
  });
}

module.exports = { makeTestSequelizeInstance };