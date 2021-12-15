const { Router } = require('express')
const router = Router()
const Institution = require('../../models/Institution')
const Likes = require('../../models/Likes')
const Profiles = require("../../models/Profiles")
const Reports = require('../../models/Reports')
const {devolverPorFecha} = require("./utils")

router.get('/getCohortes', async (req, res) => {
  let cohorte = await Institution.find({ name: "Henry" })
  res.status(200).send(cohorte[0].groups)
})


router.get('/removeuser', async (req, res) => {
  let user = req.body.id
  console.log(user)
  await Profiles.deleteMany({_id:user});
  res.status(200).send("Profile Deleted");  
})


router.get('/removegroup', async (req, res) => {
  let user = req.body.id
  
  await Profiles.findOneAndUpdate(
    { _id: user },
    { curso: ""}
  );
  res.status(200).send("User Group Deleted");  
})

router.post('/like', async (req, res) => {
  const { group, date, institution} = req.body
 
  var newLike = await new Likes({
    group:group,
    date:date,
    institution:institution,
  })
  newLike.save()
  res.send("done")
})

router.post('/report', async (req, res) => {
  const { group, date, institution } = req.body
  var newReport = await new Reports({
    group,
    date,
    institution
  })
  newReport.save()
  res.send("done")
})

router.get('/stats', async (req, res) => {
  const group = req.query.group.toUpperCase()
  const institution = req.query.institution


  if (group === "GENERAL"){
    let cohorte = await Institution.find({ name: institution })
    console.log(cohorte, " soy cohorteee")
    let cohortes = cohorte[0].groups
    console.log(cohortes, " soy cohortes")
    let cohortesPeople = []
    await Promise.all(
      cohortes.map(async (element) => {
        let people = await Profiles.find({institution:institution, curso: element })
        cohortesPeople.push({ name: element, Students: people.length })
      })
    )
    
    var getReports = await Reports.find({institution:institution})
    var getLikes = await Likes.find({institution:institution})
    res.send({likesreports: [{name:'Reports', value: getReports.length},{name:'Likes', value: getLikes.length}], students:cohortesPeople})
  }
  else if(group && group !== "GENERAL"){
    var getReports = await Reports.find({institution:institution, group:group}).sort('date')
    var getLikes = await Likes.find({institution:institution, group:group}).sort('date')
    //--------------------------------------------//
    console.log(getReports)
    const likes = await devolverPorFecha(getLikes)
    const reports = await devolverPorFecha(getReports)
    //AsCeNDENTe: order moongoose (.date-1)

    console.log(likes, "likes")
    console.log(reports, "repos! jajaj")
    res.send({likes:likes, reports: reports})
  }
})





module.exports = router
