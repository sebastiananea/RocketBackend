const { Router } = require("express");
const router = Router();
const Profile = require("../../models/Profiles");
const {
  AsignTables,
  asignTableRandom,
  encrypt,
  shuffle,
  mailer,
} = require("./utils");
const { generateProfile } = require("./loaded");
const jwt = require("jsonwebtoken");
const cache = require("../routeCache");
const { appConfig } = require("../../Config/default.js");

// GENERADOR DE PROFILES EN BASE DE DATOS
router.get("/generateProfile", async (req, res) => {
  var profiles = await generateProfile(30);

  res.send("CARGADO");
});

// BORRAR TODA LA BASE DE DATOS PROFILES
router.get("/deleteProfiles", async (req, res) => {
  await Profile.deleteMany();
  res.status(200).send("Profiles Deleted");
});

//Inscribirse
router.post("/signup", async (req, res) => {
  const { institution, curso } = req.query;
  const institutionReplace = institution.replace("%20", /\s+/g);
  var { password, email, name, country, gender, age } = req.body;
  age = parseInt(age);
  var crypted = encrypt(password);
  var emailCript = encrypt(email);

  try {
    let user = await Profile.find({ email: req.body.email });
    if (!req.body.password || !req.body.name || !req.body.email) {
      throw new Error("Los inputs requeridos son name, email, password ");
    } else if (user[0]) {
      throw new Error("El mail ya está registrado");
    } else {
      var newProfile = await new Profile({
        name,
        email,
        country,
        img: "https://s03.s3c.es/imag/_v0/770x420/a/d/c/Huevo-twitter-770.jpg",
        password: crypted,
        institution: institutionReplace,
        activateLink: emailCript,
        curso,
        gender,
        age,
      });

      await newProfile.save();
    }
  } catch (err) {
    res.json(err);
    throw new Error(err);
  }

  try {
    let info = await mailer.sendMail({
      from: '"Rocket" <rocket.app.mailing@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: "Confirmar registro Rocket ✔", // Subject line
      text: `confirm with: ${emailCript}`, // plain text body
      html: `<div style='height:450px; width:450px; background:linear-gradient(43deg, #18e, #92e); margin:auto; padding: 25px; box-sizing:border-box; border-radius:30px'>
    
      <h1 style="margin:auto; text-align:center; color:white; font-family:verdana; font-style: italic">ROCKET</h1>
      
      <div style="width:100%; text-align:center; margin-top:30px">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Creative-Tail-rocket.svg/768px-Creative-Tail-rocket.svg.png"
           style="width: 60%">
        </div>
      
      <h3 
          style="margin:auto; text-align:center; margin-top: 30px">
        <a href="https://rocketprojectarg.netlify.app/active-account/${emailCript}" target="_BLANK" 
           style='cursor:pointer; color:white; font-family:verdana; text-decoration:none'>Ready to launch?<br>Click <span style="text-decoration:underline">HERE</span> to confirm!</a></h3>
      `,
    });
    console.log("mail saxesfuli sent");
  } catch (error) {
    console.log("error mailing");
    throw new Error(error);
  }
  res.send(newProfile);
});

//Validacion isLog

router.post("/isLog", async (req, res) => {
  const { token } = req.body;
  var user = jwt.verify(token, `${appConfig.dbPass}`);
  if (user) {
    var userDb = await Profile.findById(user.id).lean();
    return res.send(userDb);
  } else return res.send(false);
});

//Ingresar
router.post("/signin", async (req, res) => {
  let { email, password } = req.body;

  let profile = await Profile.findOne({ email: email.toLowerCase() });

  if (!profile) {
    return res.send("El mail no corresponde con usuarios en la DB");
  }
  if (profile.active === false)
    return res.json({ account: "confirm your account is required" });
  if (encrypt(password) == profile.password) {
    const token = jwt.sign(
      {
        id: profile._id,
      },

      `${appConfig.dbPass}`
    );

    return res.json({ token: token });
  } else {
    res.send("Access Denied");
  }
});

//Trae todos los Usuarios
router.get("/", async (req, res) => {
  var usuario = await Profile.find();
  res.send(usuario);
});

//Actualiza el perfil del usuario
router.post("/user/changes", async (req, res) => {
  const {
    id,
    new_country,
    new_email,
    new_img,
    new_enhableContact,
    new_about,
    new_status,
    new_active,
  } = req.body;

  const profile = await Profile.findById(id);
  await Profile.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        country: new_country ? new_country : profile.country,
        email: new_email ? new_email.toLowerCase() : profile.email,
        img: new_img ? new_img : profile.img,
        about: new_about ? new_about : profile.about,
        enhableContact: new_enhableContact
          ? new_enhableContact
          : profile.enhableContact,
        status: new_status ? new_status : profile.status,
        active: new_active ? new_active : profile.active,
      },
      new: true,
    },
    async (err, result) => {
      if (result) return res.send(await Profile.findOne({ _id: id }));
      if (err) return res.send("user id invalid :S");
    }
  );
});

//Ruta asignacion de Mesas
router.post("/asignTable", async (req, res) => {
  let profiles = await Profile.find({
    institution: req.body.institution,
    curso: req.body.curso,
    moderator: false,
  });

  await Profile.updateMany(
    {
      curso: req.body.curso,
      institution: req.body.institution,
    },
    {
      $set: {
        table: 0,
      },
    },
    {
      multi: true,
    }
  );

  await AsignTables(profiles, req.body.institution, req.body.curso);
  // shuffle(users)
  // asignTable(users)

  res.send("Mesas mezcladas exitosamente");
});


router.post("/asignTableRandom", async (req, res) => {
  let profiles = await Profile.find({
    institution: req.body.institution,
    curso: req.body.curso,
    moderator: false,
  });

  await Profile.updateMany(
    {
      curso: req.body.curso,
      institution: req.body.institution,
    },
    {
      $set: {
        table: 0,
      },
    },
    {
      multi: true,
    }
  );
  await shuffle(profiles);
  await asignTableRandom(profiles);
  res.send("Mesas mezcladas aleatoriamente");
});

//Busqueda Profile By Name
router.get("/searchProfiles/:name", async (req, res) => {
  let name = req.params.name;
  let profiles = await Profile.find({
    name: { $regex: new RegExp(".*" + name + ".*", "i") },
  });
  return res.send(profiles);
});

//Busqueda Profile By ID
router.get("/searchProfileID/:id", async (req, res) => {
  let { id } = req.params;
  let profile = await Profile.findById(id);
  return res.send(profile);
});

//Busqueda Profile By pass para activar x mailing
router.get("/searchProfileActivate/:active", async (req, res) => {
  let { active } = req.params;
  let profile = await Profile.findOneAndUpdate(
    { activateLink: active },
    {
      $set: {
        active: true,
      },
      new: true,
    }
  );

  res.send(profile);
});

//Aumenta Likes
router.put("/increaseLike/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let profile = await Profile.findById(id);
    let points = profile.score + 1;
    res.send(await Profile.findByIdAndUpdate(id, { score: points }));
  } catch (err) {
    console.log(err);
  }
});

//Reportes
router.post("/increaseReports/:id", async (req, res) => {
  let { reportText } = req.body;
  let id = req.params.id;
  let profile = await Profile.findById(id);

  res.send(
    await Profile.updateOne({ _id: id }, { $push: { reports: reportText } })
  );
});
// router.put('/increaseLike', async (req, res) => {
//   let id = req.body.id;
//   let profile = await Profile.findById(id);
//   let points = profile.score + 1
//   res.send(await Profile.findByIdAndUpdate(id, {score: points}))
// })

//Filtrar usuarios por mesa

router.post("/filterUserByTable", async (req, res) => {
  let { table, curso, institution } = req.body;

  let filteredUsers = await Profile.find({
    table: table,
    curso: curso,
    institution: institution,
  });

  res.send(filteredUsers);
});

//Busqueda por institucion

router.post("/getUsersByInstitution", cache(4000), async (req, res) => {
  let { institution } = req.body;

  let filteredUsers = await Profile.find({
    insitution: institution,
  });
  res.send(filteredUsers);
});

router.post("/logMedia", async (req, res) => {
  const { name, email, img, status } = req.body;
  let exist = await Profile.findOne({ email: email.toLowerCase() });
  if (exist) {
    const token = jwt.sign(
      {
        id: exist._id,
      },

      // key desde env
      `${appConfig.dbPass}`
    );
    return res.json({ token: token });
  } else if (!exist) {
    try {
      var newProfile = await new Profile({
        name: name,
        email: email.toLowerCase(),
        img: img,
        country: "Rocket Country",
        status: status,
      });
      newProfile.save();
      const token = jwt.sign(
        {
          id: newProfile._id,
        },

        //key desde env
        `${appConfig.dbPass}`
      );
      return res.json({ token: token });
    } catch (err) {
      console.log(
        "Los campos requeridos son name, password, email, country, institución"
      );
    }
  }
});

router.post("/addPresence", async (req, res) => {
  let { ID } = req.body;
  if (ID) {
    try {
      await Profile.findByIdAndUpdate({ _id: ID }, { $inc: { presences: 1 } });
      res.send("OK")
    } catch (err) {
      console.log(err);
    }
  }
});

router.post("/addClass", async (req, res) => {
  let { institution, curso } = req.body;

  try {
    await Profile.updateMany(
      {
        curso: curso,
        institution: institution,
        moderator: false
      },
      {
        $inc: {
          classes: 1,
        },
      },
      {
        multi: true,
      }
    );
    res.send("OK")
  } catch (err) {
    console.log(err);
  }
});

router.get('/presenteeismOfCourse/:institution/:curso', async (req,res)=>{
  let {curso, institution} = req.params
  let profiles = await Profile.find({curso: curso, institution:institution, moderator:false});
  let classes = profiles[0].classes;
  let presences = 0
  for(let i = 0 ; i<profiles.length ; i++){
    presences = presences + profiles[i].presences
  }
  let presenteeism = `${((presences / profiles.length) / classes).toFixed(3)*100}%`
  res.send(presenteeism)

})
module.exports = router;
