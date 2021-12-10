const { Router } = require('express')
const router = Router()
const Institution = require('../../models/Institution')
const Likes = require('../../models/Likes')
const Reports = require('../../models/Reports')

router.get('/getCohortes', async (req, res) => {
  let cohorte = await Institution.find({ name: 'Henry' })
  res.status(200).send(cohorte[0].groups)
})

router.post('/like', async (req, res) => {
  const { group, date } = req.body
  var newLike = await new Likes({
    group,
    date,
  })
  newLike.save()
})

router.get('/like/stats', async (req, res) => {
  var getLikes = await Likes.find()
  res.send(getLikes)
})

router.post('/report', async (req, res) => {
  const { group, date } = req.body
  var newReport = await new Reports({
    group,
    date,
  })
  newReport.save()
})

router.get('/report/stats', async (req, res) => {
  var getReports = await Reports.find()
  res.send(getReports)
})





module.exports = router
