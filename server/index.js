require('dotenv/config')

const { PORT } = process.env

const express = require('express')
const path = require('path')


const app = express()

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
