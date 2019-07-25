const db = require('./data/db-config.js');
const Users = require('./api/users/user-model');
const bcrypt = require('bcryptjs');

describe('users model', () => {
  beforeEach(async () => {
    await db('users').truncate();
  });

  describe('insert function', () => {
    it('inserts users into the db', async () => {
      let userAmount;
      userAmount = await db('users');
      expect(userAmount).toHaveLength(0);
      await Users.add({
        username: 'catdog',
        password: bcrypt.hashSync('aloneintheworldisthelittlecatdog', 12),
      });
      await Users.add({
        username: 'tourist',
        password: bcrypt.hashSync('visitingcities', 12),
      });
      userAmount = await db('users');
      expect(userAmount).toHaveLength(2);
    });

    it('inserts the provided user into the db', async () => {
      let user = await Users.add({
        username: 'christian',
        password: bcrypt.hashSync('bale', 12),
      });
      expect(user.username).toBe('christian');
    });
  });
});
