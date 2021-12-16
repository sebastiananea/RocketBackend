const Profile = require("../../models/Profiles");
const Likes = require("../../models/Likes");
const Reports = require("../../models/Reports");
const { encrypt } = require("./utils");
const images = require("./avatars/avatarsarr");

var name = [
  "Micael",
  "Sebastian",
  "Franco",
  "Guillermo",
  "Liam",
  "Nicolas",
  "Lionel",
  "Lautaro",
  "Carlos",
  "Matías",
  "Lorena",
  "Sofía",
  "Agustina",
  "Bárbara",
  "Valentina",
  "Azul",
  "Catalina",
  "Julieta",
  "Natalia",
  "Delfina",
  "Emilia",
];
var lastName = [
  "Gomez",
  "Anea",
  "Gonzalez",
  "Bermúdez",
  "Riquelme",
  "Domínguez",
  "Perez",
  "García",
  "Menem",
  "Messi",
  "Álvarez",
  "Eminem",
];
var reports = [
  { value: "No participó" },
  { value: "Maleducado" },
  { value: "Un bobi" },
];
var curso = ["19", "18", "20", "21", "22"];
var curso_aob = ["A", "B"];
var gender = ["Male", "Female"];
var status = ["Online", "Offline", "Available", "Busy", "Sleeping"];
var score = [1, 2, 3, 4, 5, 6];

async function generateProfile(num) {
  for (i = 0; i < num; i++) {
    rand_name = Math.floor(Math.random() * name.length);
    rand_lastName = Math.floor(Math.random() * lastName.length);
    rand_image = Math.floor(Math.random() * images.length);
    rand_curso = Math.floor(Math.random() * curso.length);
    rand_aob = Math.floor(Math.random() * curso_aob.length);
    // rand_institution = Math.floor(Math.random() * institution.length);
    rand_gender = Math.floor(Math.random() * gender.length);
    rand_status = Math.floor(Math.random() * status.length);
    rand_score = Math.floor(Math.random() * score.length);
    rand_reports = () => {
      let number = Math.random() * 10;
      if (number > 9) return [reports[0], reports[1], reports[2]];
      else if (number > 8) return [reports[0], reports[1]];
      else if (number > 6) return [reports[0]];
    };

    var newProfile = await new Profile({
      // name: name[rand_name] + " " + lastName[rand_lastName],
      name:"Ignacio Aranda",
      age: Number(curso[rand_curso]),
      gender: gender[rand_gender],
      // password: encrypt(name[rand_name]),
      password: encrypt("ignacio"),
      status: status[rand_status],
      moderator: true,
      // email: name[rand_name] + lastName[rand_lastName] + "@gmail.com",
      email: "ignacioaranda@gmail.com",
      institution: "Henry",
      img: images[rand_image],
      // curso: curso[rand_curso] + curso_aob[rand_aob],
      curso: "18B",
      active: true,
      // score: score[rand_score],
      // reports: rand_reports(),
    });

    newProfile.save();
    return newProfile
   
  }
}

const generateLikes = async (num) => {
  var curso = ["19", "18", "20", "21", "22"];
  var curso_aob = ["A", "B"];
  var institution = "Henry";
  var months = [7, 8, 9, 6];
  for (let i = 0; i < num; i++) {
    rand_curso = Math.floor(Math.random() * curso.length);
    rand_aob = Math.floor(Math.random() * curso_aob.length);
    rand_month = Math.floor(Math.random() * months.length);

    let newLike = await new Likes({
      group: `${curso[rand_curso]}${curso_aob[rand_aob]}`,
      institution: institution,
      date : `0${months[rand_month]}-2021`,
    });
    newLike.save()
    
  }
};
const generateReports = async (num) => {
  var curso = ["19", "18", "20", "21", "22"];
  var curso_aob = ["A", "B"];
  var institution = "Henry";
  var months = [7, 8, 9, 6];
  for (let i = 0; i < num; i++) {
    rand_curso = Math.floor(Math.random() * curso.length);
    rand_aob = Math.floor(Math.random() * curso_aob.length);
    rand_month = Math.floor(Math.random() * months.length);

    let newReport = await new Reports({
      group: `${curso[rand_curso]}${curso_aob[rand_aob]}`,
      institution: institution,
      date : `0${months[rand_month]}-2021`,
    });
    newReport.save()
    
  }
};

module.exports = {
  generateProfile,
  generateLikes,
  generateReports
};
