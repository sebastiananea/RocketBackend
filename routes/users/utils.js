//librería para encriptación
const CryptoJS = require('crypto-js')
const Institution = require('../../models/Institution')
const Profile = require('../../models/Profiles')
//librería para envío de mails
const nodemailer = require("nodemailer");

//usarlo en el create del usuario, pasarle su pass de body
//y en el log in para chequear el mismo con lo que ya estará en db del user
const encrypt = (pass) => {
  var crypted = CryptoJS.SHA3(pass, { outputLength: 224 })
  crypted = crypted.toString()
  return crypted
}

//Mesas y asignacion de usuarios
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "rocket.app.mailing@gmail.com",
    pass: "giyzvxygygnzxyld", // pass oculta que nos ofrece gmail
  },
});


// Asigna numero de mesa al usuario y lo actualiza en la db
async function asignTable(users) {
  var contador = 0
  let numTable = 1
  for (let i = 0; i < users.length; i++) {
    let encryptLink = encrypt(`rocket${users[i].institution}${numTable}`)
    await Profile.findOneAndUpdate(
      { _id: users[i]._id },
      {
        $set: {
          table: numTable,
          meetLink: `https://meet.jit.si/${encryptLink}`,
        },
        new: true,
      }
    )
    contador++
    let mostrar = await Profile.findById(users[i]._id) //No estamos seguros si hace algo pero por las dudas
    if (contador == 4) {
      contador = 0
      numTable++
      let mostrar = await Profile.findById(users[i]._id) //No estamos seguros si hace algo pero por las dudas
    }
  }
}

module.exports = {
  encrypt,
  shuffle,
  asignTable,
  mailer
}
