const Profile = require("../../models/Profiles")
const { encrypt } = require("./utils");
const images = require('./avatars/avatarsarr')

var name = ["Micael", "Sebastian", "Franco","Guillermo","Liam","Nicolas","Lionel","Lautaro","Marcos"];
var lastName = ["Gomez", "Anea", "Gonzalez","Álvarez", "Bermúdez", "Riquelme", "Domínguez", "Gutiérrez "];
var institution = "Henry";

async function generateProfile(num) {

    for( i = 0; i < num; i++) {

          rand_name = Math.floor(Math.random() * name.length)
          rand_lastName = Math.floor(Math.random() * lastName.length);
          rand_image = Math.floor(Math.random() * images.length);
      
          var newProfile = await new Profile({
            name: name[rand_name] + " " + lastName[rand_lastName],
            email: name[rand_name] + lastName[rand_lastName] + "@gmail.com",
            institution: institution,
            password: encrypt(name[rand_name]),
            img: images[rand_image],
            curso: `Cohorte ${Math.ceil(Math.random()*3)}`,
            active:true

          });
          newProfile.save();
          console.log(newProfile);
    }

}

module.exports = {
  generateProfile,
};
