
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
});

// O Pool emitirá um erro se algo der errado nas conexões em background
pool.on('error', (err) => {
    console.error('Erro inesperado no cliente do Postgres', err);
});

module.exports = pool;

