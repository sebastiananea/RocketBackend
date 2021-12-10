const { Router } = require("express");
const router = Router();
const Institution = require("../../models/Institution");
const { postInstitution, postNewGroup } = require("./utils");
const { encrypt } = require("../users/utils");
const jwt = require("jsonwebtoken");
const cache = require("../routeCache");
const { appConfig } = require("../../Config/default.js");
const { isCombinedModifierFlagSet } = require("tslint");

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

module.exports = router;
