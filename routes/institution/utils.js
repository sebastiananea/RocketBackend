const Institution = require("../../models/Institution");
const { encrypt } = require("../users/utils");

// Nueva institucion
async function postInstitution({ name, email, password }) {
  try {
    const crypted = encrypt(password);
    console.log(name);
    // let userOfInstitution = await Profile.find({ institution: name });

    let newInstitution = await new Institution({
      name,
      email,
      password: crypted,
      institution: name,
      // users: userOfInstitution,
    });
    newInstitution.save();

    return newInstitution;
  } catch (error) {
    throw new Error(error);
  }
}

//Crear nuevo grupo
async function postNewGroup({ id, curso }) {
  try {
    const institution = await Institution.findById(id);
    console.log(institucion);
    return institution;
  } catch (error) {
    throw new Error(error);
  }
}

//filtra por grupo
async function filterbygroup({ curso }) {
  try {
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  postInstitution,
  filterbygroup,
  postNewGroup,
};
