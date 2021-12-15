const { Router } = require("express");
const router = Router();
const Institution = require("../../models/Institution");
const Profile = require("../../models/Profiles");
const { postInstitution, postNewGroup, refresh } = require("./utils");
const { encrypt } = require("../users/utils");
const jwt = require("jsonwebtoken");
const cache = require("../routeCache");
const { appConfig } = require("../../Config/default.js");

router.post("/signUp", async (req, res) => {
  if (!req.body.email || !req.body.name || !req.body.password) {
    res.status(404).send("Name, email and Password are required");
  }

  try {
    let newInstitution = await postInstitution(req.body);
    res.status(200).send(newInstitution);
  } catch (error) {
    throw new Error(error);
  }
});

router.post("/signIn", async (req, res) => {
  let { email, password } = req.body;

  let institutionProfile = await Institution.findOne({ email: email });

  if (encrypt(password) == institutionProfile.password) {
    const token = jwt.sign(
      {
        id: institutionProfile._id,
      },
      `${appConfig.dbPass}`
    );
    return res.json({ token: token });
  } else {
    res.send("Access Denied");
  }
});

router.post("/isLog", async (req, res) => {
  const { token } = req.body;
  var user = jwt.verify(token, `${appConfig.dbPass}`);
  if (user) {
    var userDb = await Institution.findById(user.id).lean();
    return res.send(userDb);
  } else return res.send(false);
});

router.post("/cursoNuevo", async (req, res) => {
  const { id, curso, name } = req.body;

  try {
    const institution = await Institution.findById(id);

    const boolean = institution.groups.includes(curso);

    if (boolean === true) {
      console.log("id:", id, "curso:", curso, name, "desde el true");
      res.send(false);
    } else {
      console.log("id:", id, "curso:", curso, name, "desde el else");

      newCurso = await Institution.updateOne(
        { _id: id },
        { $push: { groups: curso } }
      );
      res.send(true);
    }
  } catch (error) {
    throw new Error(Error);
  }
});

router.post("/cursos", async (req, res) => {
  const { id, name } = req.body;

  try {
    const institucion = await Institution.findById(id);

    const cursos = institucion.groups;
    cursos.length
      ? res.status(200).send(cursos)
      : res.status(404).send("Sin Cursos");
  } catch (error) {
    throw new Error(error);
  }
});

router.post("/alumnos", async (req, res) => {
  const { name, value } = req.body;

  try {
    let filteredUsers = await Profile.find({
      moderator: false,
      institution: { $regex: new RegExp(".*" + name + ".*", "i") },
    });

    filteredUsers.length
      ? res.status(200).send(filteredUsers)
      : res.status(404).send("No hay alumnos");
  } catch (error) {
    throw new Error(error);
  }
});

router.post("/setInstructor", async (req, res) => {
  const { id, moderator } = req.body;
  console.log("Quitar Instructor", id, moderator);
  try {
    let instructor = await Profile.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          moderator: moderator,
        },
        new: true,
      },
      async (err, result) => {
        if (result) return res.send(await Profile.findOne({ _id: id }));
        if (err) return res.send("user id invalid :S");
      }
    );
    console.log(result);
  } catch (error) {
    throw new Error(Error);
  }
});

router.post("/instructores", async (req, res) => {
  const { name, value } = req.body;
  console.log(name);
  try {
    let filteredInstructors = await Profile.find({
      moderator: true,
      institution: { $regex: new RegExp(".*" + name + ".*", "i") },
    });

    filteredInstructors.length
      ? res.status(200).send(filteredInstructors)
      : res.status(404).send("No hay Instructores");
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
