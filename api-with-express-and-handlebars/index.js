const express = require('express')
const hbs = require('hbs')
const routes = require('./routes/routes')
const path = require('path')
const app = express()
const PORT = 3000

let cors = require('cors')
let corsOptions = {
  credentials:true,
}

app.set('view engine', hbs)

app.use(cors(corsOptions))
app.use('/', routes)
app.use(express.static(path.join(__dirname, '/public')))

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`)
})
module.exports = app
