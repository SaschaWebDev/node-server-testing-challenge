const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'sascha',
          password: bcrypt.hashSync('toosimple', 10),
        },
        {
          username: 'hanne',
          password: bcrypt.hashSync('plaintext', 10),
        },
        {
          username: 'thiara',
          password: bcrypt.hashSync('wownosecurity', 10),
        },
      ]);
    });
};
