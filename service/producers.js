class ProducerService {
  constructor(db) {
    this.db = db;
  }

  async getAggregate() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT year, producers 
        FROM premios
        WHERE winner = 'yes'
        ORDER BY year;
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          console.error('Erro ao consultar o banco de dados:', err.message);
          return reject(err);
        }

        resolve(this.processData(rows));
      });
    });
  }

  async processData(winnersList) {
    const winners = [];
    const separators = /\s*(?:and|,)\s*/;

    for (const winner of winnersList) {
      const producers = winner.producers.split(separators);
      const year = winner.year;

      for (const producer of producers) {
        winners.push({ producer: producer.trim(), wins: [year] });
      }
    }

    console.log('previa', winners);

    return winnersList;
  }
}


module.exports = ProducerService;
