const express = require('express')
const router = express.Router()
const { Create, Login } = require('../controller/auth.controller')
const { Restrict } = require('../middleware/middleware')
const { ResponseTemplate } = require('../helper/template.helper')

router.post('/auth/create', Create)
router.post('/auth/login', Login)
// router.post('/auth/authenticate', Restrict, (req, res) => {
//     let user = {
//         user: req.user
//     }
//     let resp = ResponseTemplate(user, 'success', null, 200)
//     return res.json(resp)
// })

router.post('/auth/forgot-password', ForgotPassword);
module.exports = router