const express = require('express')
const app = express()
const Sentry = require('@sentry/node');
const router = require('./routes/route')

const http = require('http').Server(app)
const io = require('socket.io')(http)
const jwt = require('jsonwebtoken')
const { CompareToken } = require('./helper/hash.helper')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// require('dotenv').config()

const initializeSentry = require('./lib/sentry')
initializeSentry

const port = process.env.PORT || 3000
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.json())
app.use(express.urlencoded({extended:false}))