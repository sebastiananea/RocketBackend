//librería para encriptación

const CryptoJS = require('crypto-js')
const Institution = require('../../models/Institution')
const Profile = require('../../models/Profiles')
//librería para envío de mails
const nodemailer = require("nodemailer");


//usarlo en el create del usuario, pasarle su pass de body
//y en el log in para chequear el mismo con lo que ya estará en db del user
const encrypt = (pass) => {
  var crypted = CryptoJS.SHA3(pass, { outputLength: 224 });
  crypted = crypted.toString();
  return crypted;
};

//Mesas y asignacion de usuarios
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
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
async function asignTableRandom(users) {
  var contador = 0;
  let numTable = 1;
  for (let i = 0; i < users.length; i++) {
    let encryptLink = encrypt(`rocket${users[i].institution}${numTable}`);
    await Profile.findOneAndUpdate(
      { _id: users[i]._id },
      {
        $set: {
          table: numTable,
          meetLink: `https://meet.jit.si/${encryptLink}`,
        },
        new: true,
      }
    );
    contador++;
    let mostrar = await Profile.findById(users[i]._id); //No estamos seguros si hace algo pero por las dudas
    if (contador == 4) {
      contador = 0;
      numTable++;
      let mostrar = await Profile.findById(users[i]._id); //No estamos seguros si hace algo pero por las dudas
    }
  }
}

async function AsignTables(profiles, Institution, Group) {

  let integrantes = 4;

  if (profiles.length === 6) {
    //Si los alumnos son 6, se forman dos grupos de 3
    integrantes = 3;
  }

  profiles.sort(function (a, b) {
    //Ordeno a los alumnos según los rockets
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    return 0;
  });

  let profiles0 = profiles.slice(0, Math.floor(profiles.length / 4));
  let profiles1 = profiles.slice(
    Math.floor(profiles.length / 4),
    Math.floor(profiles.length / 2)
  );
  let profiles2 = profiles.slice(
    Math.floor(profiles.length / 2),
    Math.floor((profiles.length / 4) * 3)
  );
  let profiles3 = profiles.slice(Math.floor((profiles.length / 4) * 3));
  shuffle(profiles0);
  shuffle(profiles1);
  shuffle(profiles2);
  shuffle(profiles3);
  let lesprofiles = [profiles0, profiles1, profiles2, profiles3]; //Corte a los alumnos en 4 grupos

  let contador = 0;
  let contador2 = 0;
  let numTable = 1;
  let solos;
  let encryptLink;
  let cortar = false

  for (let i = 0; i < profiles.length; i++) {
    //Recorro la cantidad de alumnos que hay
    encryptLink = encrypt(`rocket${Institution}${Group}${numTable}`);
    try {
      if (lesprofiles[contador][contador2]) {
        await Profile.findOneAndUpdate(
          { _id: lesprofiles[contador][contador2]._id },
          {
            $set: {
              table: numTable,
              meetLink: `https://meet.jit.si/${encryptLink}`,
            },
            new: true,
          }
        );
      } else if (profiles % integrantes === 0) {
        //Si los usuarios fueran multiplos de 4, cortamos aca.
        break;
      } else {
        //No son múltiplos de 4. ¿Cuantos sobran?
        solos = await Profile.find({ table: 0 });
        console.log(solos)

        if (solos.length === 3) {
          //Si sobran 3: Sale grupo de 3
          //Si sobran 3
          encryptLink = encrypt(`rocket${Institution}${Group}${numTable}`);
          for (let j = 0; j < solos.length; j++) {
            await Profile.findOneAndUpdate(
              { _id: solos[j]._id },
              {
                $set: {
                  table: numTable,
                  meetLink: `https://meet.jit.si/${encryptLink}`,
                },
                new: true,
              }
            );
          }
          cortar = true
          break;
        } else {
          //Si sobran 2 o 1: los tiramos en otros grupos
          for (let k = 1; k <= solos.length; k++) {
            console.log(k, numTable - k)
            await Profile.findOneAndUpdate(
              { _id: solos[k-1]._id },
              {
                $set: {
                  table: numTable - k,
                  meetLink: `https://meet.jit.si/${encrypt(
                    `rocket${Institution}${Group}${numTable - k}`
                  )}`,
                },
                new: true,
              }
            );
          }
          cortar = true
          break;

        }
      }
      if(cortar){
        break
      }
      contador++;
      if (contador == integrantes) {
        contador = 0;
        contador2++;
        numTable++;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = {
  AsignTables,
  encrypt,
  shuffle,
  asignTableRandom,
  mailer
}

