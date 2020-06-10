import knex from 'knex';

const connection = knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'vertrigo',
        database: 'ecoleta'
    }
})

export default connection