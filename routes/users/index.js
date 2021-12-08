const { Router, application } = require('express')
const router = Router()
const Profile = require('../../models/Profiles')
const { asignTable, encrypt, shuffle, mailer } = require('./utils')
const { generateProfile } = require('./loaded')
const jwt = require('jsonwebtoken')
const cache = require('../routeCache');
const { appConfig } = require("../../Config/default.js");


// GENERADOR DE PROFILES EN BASE DE DATOS
router.get('/generateProfile', async (req, res) => {
  var profiles = await generateProfile(30)
  res.send('CARGADO')
})

// BORRAR TODA LA BASE DE DATOS PROFILES
router.get('/deleteProfiles', async (req, res) => {
  await Profile.deleteMany()
  res.status(200).send('Profiles Deleted')
})

//Inscribirse
router.post('/signup', async (req, res) => {
  const { password, email } = req.body
  var crypted = encrypt(password)
  var emailCript = encrypt(email)
  var newProfile = {}
  try {
    let user = await Profile.find({ email: req.body.email })
    if (!req.body.password || !req.body.name || !req.body.email) {
      throw new Error('Los inputs requeridos son name, email, password ')
    } else if (user[0]) {
      throw new Error('El mail ya está registrado')
    } else {
      newProfile = await new Profile({
        name: req.body.name,
        email: req.body.email,
        country: req.body.country,
        img: 'https://s03.s3c.es/imag/_v0/770x420/a/d/c/Huevo-twitter-770.jpg',
        password: crypted,
        activateLink: emailCript,
      })
      let responseProfile
      await newProfile.save()
    }
  } catch (err) {
    res.json(err)
    console.log(err)
  }

  try {
    let info = await mailer.sendMail({
      from: '"Rocket" <rocket.app.mailing@gmail.com>', // sender address
      to: `${req.body.email}`, // list of receivers
      subject: 'Confirmar registro Rocket ✔', // Subject line
      text: `confirm with: ${emailCript}`, // plain text body
      html: `Confirm Rocket supscription in the following link: <a href="https://rocketprojectarg.netlify.app/active-account/${emailCript}">LINK TO CONFIRM</a>`, // html body
    })
    console.log('mail sent')
  } catch (error) {
    return console.log('error mailing' + error)
  }
  res.send(newProfile)
})


//Validacion isLog
router.post('/isLog', async (req, res) => {
  const { token } = req.body
  var user = jwt.verify(token, `${appConfig.dbPass}`)
  if (user) {
    var userDb = await Profile.findById(user.id).lean()
    return res.send(userDb)
  } else return res.send(false)
})

//Ingresar
router.post('/signin', async (req, res) => {
  let { email, password } = req.body

  let profile = await Profile.findOne({ email: email })

  if (!profile) {
    return res.send('El mail no corresponde con usuarios en la DB')
  }
  if(profile.active===false) return res.json({account:'confirm your account is required'});
  if (encrypt(password) == profile.password) {
    const token = jwt.sign(
      {
        id: profile._id,
      },

      `${appConfig.dbPass}`
    )
    return res.json({ token: token })
  } else {
    res.send('Access Denied')
  }
})

//Trae todos los Usuarios
router.get('/', async (req, res) => {
  var usuario = await Profile.find()
  res.send(usuario)
})

//Actualiza el perfil del usuario
router.post('/user/changes', async (req, res) => {
  const {
    id,
    new_country,
    new_email,
    new_img,
    new_enhableContact,
    new_about,
    new_status,
    new_active
  } = req.body

  const profile = await Profile.findById(id)
  await Profile.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        country: new_country ? new_country : profile.country,
        email: new_email ? new_email : profile.email,
        img: new_img ? new_img : profile.img,
        about: new_about ? new_about : profile.about,
        enhableContact: new_enhableContact
          ? new_enhableContact
          : profile.enhableContact,
        status: new_status ? new_status : profile.status,
        active: new_active ? new_active : profile.active
      },
      new: true,
    },
    async (err, result) => {
      if (result) return res.send(await Profile.findOne({ _id: id }))
      if (err) return res.send('user id invalid :S')
    }
  )
})

//Ruta asignacion de Mesas
router.post('/asignTable', async (req, res) => {
  var users = await Profile.find()
  shuffle(users)
  asignTable(users)
  res.send(users)
})

//Busqueda Profile By Name
router.get('/searchProfiles/:name', async (req, res) => {
  let name = req.params.name
  let profiles = await Profile.find({
    name: { $regex: new RegExp('.*' + name + '.*', 'i') },
  })
  return res.send(profiles)
})

//Busqueda Profile By ID
router.get('/searchProfileID/:id', async (req, res) => {
  let { id } = req.params
  let profile = await Profile.findById(id)
  return res.send(profile)
})

//Busqueda Profile By pass para activar x mailing
router.get('/searchProfileActivate/:active', async (req, res) => {
  let { active } = req.params
  let profile= await Profile.findOneAndUpdate(
      { activateLink: active },
      {
        $set: {
          active:true
        },
        new: true,
      })
 
 
  return res.send(profile)
  
})

//Aumenta Likes
router.put('/increaseLike/:id', async (req, res) => {
  try {
    let id = req.params.id
    let profile = await Profile.findById(id)
    let points = profile.score + 1
    res.send(await Profile.findByIdAndUpdate(id, { score: points }))
  } catch (err) {
    console.log(err)
  }
})

//Reportes
router.post('/increaseReports/:id', async (req, res) => {
  let { reportText } = req.body
  let id = req.params.id
  let profile = await Profile.findById(id)

  res.send(
    await Profile.updateOne({ _id: id }, { $push: { reports: reportText } })
  )
})
// router.put('/increaseLike', async (req, res) => {
//   let id = req.body.id;
//   let profile = await Profile.findById(id);
//   let points = profile.score + 1
//   res.send(await Profile.findByIdAndUpdate(id, {score: points}))
// })

//Filtrar usuarios por mesa
router.post('/filterUserByTable', async (req, res) => {
  let { table } = req.body

  let filteredUsers = await Profile.find({
    table: table,
  })

  res.send(filteredUsers)
})

//Busqueda por institucion
router.post('/getUsersByInstitution', async (req, res) => {
  let { institution } = req.body

  let filteredUsers = await Profile.find({
    insitution: institution,
  })

  res.send(filteredUsers)
})

router.post('/logMedia', async (req, res) => {
  const { name, email, img, status } = req.body
  let exist = await Profile.findOne({ email: email })
  if (exist) {
    const token = jwt.sign(
      {
        id: exist._id,
      },
      // key desde env
      `${appConfig.dbPass}`
    )
    return res.json({ token: token })
  } else if (!exist) {
    try {
      var newProfile = await new Profile({
        name: name,
        email: email,
        img: img,
        country: 'Rocket Country',
        status: status,
      })
      newProfile.save()
      const token = jwt.sign(
        {
          id: newProfile._id,
        },
        //key desde env
        `${appConfig.dbPass}`
      )
      return res.json({ token: token })
    } catch (err) {
      console.log(
        'Los campos requeridos son name, password, email, country, institución'
      )
    }
  }
})

module.exports = router
