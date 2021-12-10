const { Router } = require('express')
const router = Router()
const Institution = require('../../models/Institution')
const Likes = require('../../models/Likes')
const Profiles = require("../../models/Profiles")
const Reports = require('../../models/Reports')
const {devolverPorFecha} = require("./utils")

router.get('/getCohortes/:cohorte', async (req, res) => {
  let cohorte = await Institution.find({ name: req.params.cohorte })
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

router.get('/stats', async (req, res) => {
  const group = req.query.group.toUpperCase()

  if (group === "GENERAL"){
    let cohorte = await Institution.find({ name: 'Henry' })
    let cohortes = cohorte[0].groups
    let cohortesPeople = []
    await Promise.all(
      cohortes.map(async (element) => {
        let people = await Profiles.find({ curso: element })
        cohortesPeople.push({ name: element, Students: people.length })
      })
    )
    var getReports = await Reports.find()
    var getLikes = await Likes.find()
    res.send({likesreports: [{name:'Reports', value: getReports.length},{name:'Likes', value: getLikes.length}], students:cohortesPeople})
  }
  else if(group && group !== "GENERAL"){
    var getReports = await Reports.find({group:group})
    var getLikes = await Likes.find({group:group})
    //--------------------------------------------//
    const likes = await devolverPorFecha(getLikes)
    const reports = await devolverPorFecha(getReports)

    res.send({likes:likes, reports: reports})
  }
})





module.exports = router
