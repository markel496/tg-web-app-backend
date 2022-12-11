const express = require('express')
const cors = require('cors')
const product = require('./api/product')

const app = express()

app.use(express.json()) //позволит парсить json
app.use(cors()) //для кросс-доменных запросов

app.use('/', product)

const PORT = process.env.PORT || 4200

app.listen(PORT, () => console.log('Server started on PORT ' + PORT))
