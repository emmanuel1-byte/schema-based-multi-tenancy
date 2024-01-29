const express = require('express')
const CookieParser = require('cookie-parser')
const { testDatabaseConnection } = require('./database')
const { createTenant, createTask, getTasks } = require('./controller')
const { Sequelize } = require('sequelize')
const { Tenant } = require('./tenant')
const app = express()

app.use(express.json())
app.use(CookieParser())


// Test Database connection
testDatabaseConnection()

app.use('/app', createTenant)

// Application middleware to set schema based on request
app.use((req, res, next) => {
    try {
        const tenantSchema = req.headers['x-tenant-schema']
        if (!tenantSchema) return res.status(400).json({ message: 'tenant schema is required' })
        req.tenantSchema = tenantSchema
        next()
    } catch (err) {
        next(err)
    }
})

// Application middleware  to set the Sequelize connection based on tenantSchema
app.use(async (req, res, next) => {
    try {

        const tenant = await Tenant.findOne({
            where: { schema: req.tenantSchema }
        })
        if (!tenant) return res.status(404).json({ message: 'Tenant not found' })

        // Use the schema name for the tenant's connection
        const sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
            {
                logging: false,
                schema: tenant.schema
            })
        req.sequelize = sequelize
        next()
    } catch (err) {
        next(err)
    }
})

app.use('/create-task', createTask)

app.use('/tasks', getTasks)

app.get('/', (req, res) => {
    res.status(200).json({ message: "multi-tenancy is running.." })
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
})

app.use('*', (req, res) => {
    res.status(400).json({ message: "Endpoint does not exist" })
})

module.exports = app

