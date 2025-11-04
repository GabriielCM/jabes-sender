// add-db.js
const { insertContato, db } = require('./database');

const contatos = [
  { nome: 'Gabriel Rodrigues', cnpj: '123.456.789-00', telefone: '5544999721495' },
  { nome: 'Moacir Rodrigues',  cnpj: '987.654.321-00', telefone: '5544997059174' }
];

contatos.forEach(c => {
  insertContato(c.nome, c.cnpj, c.telefone, id => {
    console.log(`Adicionado: ${id} → ${c.nome}`);
  });
});

process.on('exit', () => db.close());