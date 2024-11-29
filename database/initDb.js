const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor() {
    this.db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
      } else {
        console.log('SQLite iniciado em memória.');
      }
    });
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS premios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          year INTEGER,
          title TEXT,
          studios TEXT,
          producers TEXT,
          winner TEXT
        );
      `;

      this.db.run(createTableQuery, (err) => {
        if (err) {
          console.error('Erro ao criar a tabela:', err.message);
          reject(err);
        } else {
          console.log('Tabela criada com sucesso.');
          resolve();
        }
      });
    });
  }

  getConnection() {
    return this.db;
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Erro ao fechar o banco de dados:', err.message);
      } else {
        console.log('Conexão com o banco de dados fechada.');
      }
    });
  }
}

module.exports = Database;
