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

  processData(winnersList) {
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

    return this.groupByInterval(producerMap);
  }

  groupByInterval(producerMap) {
    const minIntervals= [];
    const maxIntervals = [];

    for (const [producer, years] of producerMap) {
      if (years.length > 1) {
        years.sort((a,b) => a - b);

        const differences = [];
        for (let i = 1; i < years.length; i++) {
          differences.push({
            interval: years[i] - years[i - 1],
            previousWin: years[i - 1],
            followingWin: years[i],
          });
        }

        const maxDifference = Math.max(...differences.map(diff => diff.interval));

        if (maxDifference > 1) {
          differences.forEach(diff => {
            if (diff.interval === maxDifference) {
              maxIntervals.push({
                producer,
                interval: diff.interval,
                previousWin: diff.previousWin,
                followingWin: diff.followingWin,
              });
            }  
          });
        }

        for (let i = 1; i < years.length; i++) {
          const consecutiveInterval = years[i] - years[i - 1];
          if (consecutiveInterval === 1) {
            minIntervals.push({
              producer,
              interval: consecutiveInterval,
              previousWin: years[i - 1],
              followingWin: years[i],
            });
          }
        }
      }
    }

    return {
      min: minIntervals,
      max: maxIntervals,
    };
  }
}


module.exports = ProducerService;