const Profile = require("../../models/Profiles")
const { encrypt } = require("./utils");
const images = require('./avatars/avatarsarr')

var name = ["Micael", "Sebastian", "Franco","Guillermo","Liam","Nicolas","Lionel","Lautaro","Marcos"];
var lastName = ["Gomez", "Anea", "Gonzalez","Álvarez", "Bermúdez", "Riquelme", "Domínguez", "Gutiérrez "];
var institution = "Universidad de buenos aires  ";
var curso=["19","6b","sebastian","5000sssss00","500000"]
var curso_aob=["A", "B"]

async function generateProfile(num) {

    for( i = 0; i < num; i++) {

          rand_name = Math.floor(Math.random() * name.length)
          rand_lastName = Math.floor(Math.random() * lastName.length);
          rand_image = Math.floor(Math.random() * images.length);
          rand_curso = Math.floor(Math.random() * curso.length);
          rand_aob = Math.floor(Math.random() * curso_aob.length);
          rand_genre= ["Male", "Female"]
      
          var newProfile = await new Profile({
            name: name[rand_name] + " " + lastName[rand_lastName],
            email: name[rand_name] + lastName[rand_lastName] + "@gmail.com",
            institution: institution,
            password: encrypt(name[rand_name]),
            img: images[rand_image],
            curso: curso[rand_curso]+curso_aob[rand_aob],
            active:true,
            age:Number(curso[rand_curso]),
            genre: rand_genre[Math.ceil(Math.random()*2)]

          });
          newProfile.save();
    }

}

module.exports = {
  generateProfile,
};
