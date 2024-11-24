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

        // const groupedProducers = rows.map(row => ({
        //   producer: row.producers,
        //   moviesCount: row.movies_count,
        // }));

        resolve(rows);
      });
    });
  }
}

module.exports = ProducerService;
