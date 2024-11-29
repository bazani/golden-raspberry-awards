const fs = require('fs');
const csv = require('csv-parser');

function loadCsvToDatabase(db, csvFilePath) {

  let isFirstRow = true;

  fs.createReadStream(csvFilePath)
    .pipe(csv({separator: ';'}))
    .on('data', (row) => {
      // ignora cabeçalho
      if (isFirstRow) {
        isFirstRow = false;
        const actualHeaders = Object.keys(row);
        
        if (isNaN(Number(actualHeaders[0]))) {
            return;
        }
      }

      const { year, title, studios, producers, winner } = row;

      db.run(
        `INSERT INTO premios (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)`,
        [ year, title, studios, producers, winner ],
        (err) => {
          if (err) {
            console.error('Erro ao inserir dados:', err.message);
            process.exit(1);
          }
        }
      );
    })
    .on('end', () => {
      console.log('Dados do CSV carregados no banco.');
    });
}

module.exports = loadCsvToDatabase;
