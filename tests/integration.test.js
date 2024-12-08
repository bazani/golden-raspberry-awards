const request = require('supertest');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');

const Database = require('../database/initDb');
const ApiController = require('../controller/controller');
const loadCsvToDatabase = require('../database/loadCsv');


let api;
let db;
const csvPath = path.join(__dirname, '../movielist.csv');
const expectedColumns = ['year', 'title', 'studios', 'producers', 'winner'];

beforeAll(async () => {
    const dbInstance = new Database();
    await dbInstance.initialize();
    db = dbInstance.getConnection();

    await loadCsvToDatabase(db, csvPath);

    api = new ApiController(db);
});

describe('Integration tests', () => {
  it('should return the producers with the smallest and largest intervals', async () => {
    const response = await request(api.getApp()).get('/premios');

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    expect(response.body.min[0]).toHaveProperty('producer');
    expect(response.body.min[0]).toHaveProperty('interval');
    expect(response.body.min[0]).toHaveProperty('previousWin');
    expect(response.body.min[0]).toHaveProperty('followingWin');
  });

  it('should verify if the csv file have the appropriate columns and values', async () => {
    const columns = await new Promise((resolve, reject) => {
      const headers = [];
      let isFirstRow = true;

      fs.createReadStream(csvPath)
        .pipe(csvParser({separator: ';'}))
        .on('error', (err) => {
          reject(err)
        })
        .on('headers', (csvHeaders) => {
          headers.push(...csvHeaders);
        })
        .on('data', (row) => {
          if (isFirstRow) {
            isFirstRow = false;
            const actualHeaders = Object.keys(row);
            
            if (isNaN(Number(actualHeaders[0]))) {
                return;
            }
          }

          const { year, title, studios, producers, winner } = row;

          expect(isNaN(year)).toBe(false);
          expect(title.length).toBeGreaterThan(0);
          expect(studios.length).toBeGreaterThan(0);
          expect(producers.length).toBeGreaterThan(0);

          if (winner) {
            expect(winner).toBe('yes');
          }
        })
        .on('end', () => {
          resolve(headers);
        })
    });

    expect(columns.length).toEqual(expectedColumns.length);

    const missingColumns = expectedColumns.filter(col => !columns.includes(col));
    expect(missingColumns).toEqual([]);
  });
});

afterAll(async () => {
    if (db) await db.close();
});