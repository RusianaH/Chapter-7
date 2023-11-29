const express = require('express')
const authRoute = require('./auth.routes')
const morgan = require('morgan')
const router = require('./auth.routes')

router.use('/api', v1)

module.exports = router