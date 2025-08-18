const bcrypt = require('bcrypt');

const plainPassword = 'adminadmin'; // promeni po potrebi

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error('Greška pri hashovanju:', err);
  } else {
    console.log('Hashovana lozinka:', hash);
  }
});