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

  describe('delete function', () => {
    it('deletes users from the db', async () => {
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
      await Users.remove(1);
      userAmount = await db('users');
      expect(userAmount).toHaveLength(1);
    });

    it('deletes users also after insertion from the db', async () => {
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
      await Users.remove(1);
      await Users.add({
        username: 'tester3',
        password: bcrypt.hashSync('tessster', 12),
      });
      userAmount = await db('users');
      expect(userAmount).toHaveLength(2);
    });
  });
});
