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
    const separators = /(\s*, and\s+)|(\s*,\s*|\s+and\s+)/g;
    const producerMap = new Map();

    for (const winner of winnersList) {
      const year = winner.year;
      const producers = winner.producers.split(separators).filter(Boolean);

      for (const producer of producers) {
        const trimmedProducer = producer.trim();

        if (trimmedProducer !== ',' && trimmedProducer !== 'and' && trimmedProducer !== ', and') {
          if (!producerMap.has(trimmedProducer)) {
            producerMap.set(trimmedProducer, []);
          }
          producerMap.get(trimmedProducer).push(year);
        }
      }
    }

    const intervals = [];

    for (const [producer, years] of producerMap) {
      if (years.length > 1) {
        const interval = Math.max(...years) - Math.min(...years);
        intervals.push({ producer, interval });
      }
    }

    const minInterval = Math.min(...intervals.map(entry => entry.interval));
    const maxInterval = Math.max(...intervals.map(entry => entry.interval));

    const minProducers = intervals.filter(entry => entry.interval === minInterval);
    const maxProducers = intervals.filter(entry => entry.interval === maxInterval);

    console.log('intervalo minimo', minInterval);
    console.log('intervalo maximo', maxInterval);

    console.log('producers min', minProducers);
    console.log('producers max', maxProducers);


    return winnersList;
  }
}


module.exports = ProducerService;
