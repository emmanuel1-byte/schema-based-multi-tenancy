require('dotenv').config()
const app = require('./app')

const port = process.env.PORT || 9000 

app.listen(port, ()=>{
    console.clear()
    console.log(`Backend system is listening on port ${port}`)
})