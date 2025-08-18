const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Tesl@Nikola88',
  database: 'travelApp'
});
/*
function insertUser(user) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO users (name, lastName, phoneNumber, role, email, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      user.name,
      user.lastName,
      user.phoneNumber,
      user.role,
      user.email,
      user.password
    ];

    console.log('📥 Executing DB insert...');
    db.query(query, values, (err, results) => {
      console.log('📥 Callback entered'); // mora da se vidi
      if (err) {
        console.error('❌ DB insert error:', err);
        return reject(err);
      }
      console.log('✅ DB insert results:', results);
      resolve(results);
    });
  });
}
*/
module.exports = db;
