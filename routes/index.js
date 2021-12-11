const { Router } = require('express')

const institutionRoute = require('./institution/index')
// const usersRoute = require("../routes/users/index");
const usersRoute = require('./users/index')
const adminRoute = require('./admin/index')
const paymentRoute = require('./payment/mercadopago')

const router = Router()
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/', usersRoute)
router.use('/institution', institutionRoute)
router.use('/admin', adminRoute)
router.use('/payment', paymentRoute)

module.exports = router
