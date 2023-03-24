const express = require('express')
const app = express()

//middleware
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

//routers
const router = require('./routes/user-router')
app.use('/api/users', router)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`port is running on ${PORT}`)
})