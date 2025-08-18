const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'styles.css'); // ili drugi fajl gde se nalazi import

fs.readFile(targetFile, 'utf8', (err, data) => {
  if (err) return console.error('Greška pri čitanju fajla:', err);

  const updated = data.replace(/@import\s+['"]src\/styles\.css['"];/g, '');

  fs.writeFile(targetFile, updated, 'utf8', err => {
    if (err) return console.error('Greška pri pisanju fajla:', err);
    console.log('Import linija uspešno uklonjena.');
  });
});