const db = require('./db');

console.log("Criando a tabela...");
db.exec(`
    CREATE TABLE IF NOT EXISTS indicadores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uf TEXT,
        tipo_cliente TEXT,
        operacoes INTEGER,
        carteira_ativa REAL,
        inadimplencia REAL,
        data_base TEXT
    )
`);

console.log("Limpando dados antigos (se houver)...");
db.exec('DELETE FROM indicadores');

console.log("Inserindo dados de teste...");
const insert = db.prepare(`
    INSERT INTO indicadores (uf, tipo_cliente, operacoes, carteira_ativa, inadimplencia, data_base)
    VALUES (?, ?, ?, ?, ?, ?)
`);

// Inserindo dados de SP que somados batem EXATAMENTE com o exemplo da sua tarefa
insert.run('SP', 'PF', 1000000, 80000000.00, 4.0, '2024-06');
insert.run('SP', 'PJ', 234567, 18765432.10, 4.4, '2024-06');

// Inserindo um dado do RJ para podermos testar o filtro da API depois
insert.run('RJ', 'PF', 50000, 2000000.00, 2.1, '2024-06');

console.log("Banco de dados pronto! Você já pode rodar sua API.");