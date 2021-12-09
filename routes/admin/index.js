const { Router } = require('express')
const router = Router()
const Institution = require('../../models/Institution')

router.get('/getCohortes', async (req, res) => {
  let cohortes = await Institution.find({ name: 'Henry' })
  res.status(200).send(cohortes[0].groups)
})

module.exports = router
