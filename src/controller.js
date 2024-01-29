const { Sequelize, DataTypes } = require("sequelize")
const { sequelize } = require("./database")
const { Tenant } = require("./tenant")

// Function that creates a new Tenant(Organization)
const createTenant =  async function createTenant(req, res, next){
    try{
        const { name, schema } = req.body
        const data = await Tenant.create({ name, schema })
        await sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${data.schema}`)
        if (!data) return res.status(500).json({ message: 'Organization not created' })
        return res.status(201).json({ message: "Organization created" })
    }catch(err){
        next(err)
    }
}

// Function that creates a new task
const createTask = async function(req, res, next){
    try{
        const { task } = req.body
        const sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
        {
            logging: false,
            schema:  req.tenantSchema
        })
        const Task = sequelize.define('Task', {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            }, 

            task: {
                type: DataTypes.STRING,
                allowNull: false
            }
        })
        await sequelize.sync()
        const data =  await Task.create({ task})
        return res.status(201).json({ message: "Task Created", data: data})

    }catch(err){
        next(err)
    }
}

// Function that retrieves all task base on the current schema
const getTasks = async function(req, res, next){
    try{
        const Task = req.sequelize.define('Task', {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            }, 

            task: {
                type: DataTypes.STRING,
                allowNull: false
            }
        })

        const data = await Task.findAll()
        return res.status(201).json({ message: "Task retrieved", data: data})
    }catch(err){
        next(err)
    }
}

module.exports = {  createTenant, createTask, getTasks }