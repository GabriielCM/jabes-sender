// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./contatos.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contatos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cnpj TEXT NOT NULL,
      telefone TEXT NOT NULL
    )
  `);
});

function getAllContatos(callback) {
  db.all('SELECT * FROM contatos', [], (err, rows) => {
    if (err) {
      throw err;
    }
    callback(rows);
  });
}

// Função para inserir contatos (exemplo, pode ser usada para testes)
function insertContato(nome, cnpj, telefone, callback) {
  db.run('INSERT INTO contatos (nome, cnpj, telefone) VALUES (?, ?, ?)', [nome, cnpj, telefone], function(err) {
    if (err) {
      return console.error(err.message);
    }
    callback(this.lastID);
  });
}

module.exports = { getAllContatos, insertContato, db };