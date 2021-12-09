const { Router } = require('express')
const router = Router()
const Institution = require('../../models/Institution')
const Likes = require('../../models/Likes')
const Reports = require('../../models/Reports')

router.get('/getCohortes', async (req, res) => {
  let cohortes = await Institution.find({ name: 'Henry' })
  res.status(200).send(cohortes[0].groups)
})

router.post('/like', async (req, res) => {
  const { group, date } = req.body
  var newLike = await new Likes({
    group,
    date,
  })
  newLike.save()
})

router.post('/report', async (req, res) => {
  const { group, date } = req.body
  var newReport = await new Reports({
    group,
    date,
  })
  newReport.save()
})

module.exports = router
