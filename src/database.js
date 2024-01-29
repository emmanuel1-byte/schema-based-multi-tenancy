require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize( `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`, {
    logging: false
})

// Database connection
async function testDatabaseConnection() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Database connection established successfully')
    } catch (err) {
        console.log('Database connection not established..............', err)
    }
}

module.exports = { sequelize, testDatabaseConnection }
