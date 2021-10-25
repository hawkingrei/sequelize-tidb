require('./helper');

const { expect } = require('chai');
const { Sequelize, DataTypes } = require('../source');

describe('upsert', function () {
  it('supports Tidb', function () {
    expect(Sequelize.supportsTiDB).to.be.true;
  });

  it('works with RETURNING', async function () {
    const User = this.sequelize.define('user', { name: DataTypes.STRING });
    await User.sync({ force: true });

    const { id } = await User.create({ name: 'Someone' });

    const [userReturnedFromUpsert1] = await User.upsert(
      { id, name: 'Another Name' },
      { returning: true }
    );
    const user1 = await User.findOne();

    expect(user1.name).to.equal('Another Name');
    expect(userReturnedFromUpsert1.name).to.equal('Another Name');

    const [userReturnedFromUpsert2] = await User.upsert(
      { id, name: 'Another Name 2' },
      { returning: '*' }
    );
    const user2 = await User.findOne();

    expect(user2.name).to.equal('Another Name 2');
    expect(userReturnedFromUpsert2.name).to.equal('Another Name 2');
  });
});