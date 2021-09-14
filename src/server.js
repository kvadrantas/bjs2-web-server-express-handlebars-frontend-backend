// Fast, unopinionated, minimalist web framework for node.
// const express = require('express')
// const app = express()
// app.get('/', function (req, res) {
//   res.send('Hello World')
// })
// app.listen(3000)

// HTML URL STRUCTURE
// https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL

// EXPRESS SERVER HELP 
// http://expressjs.com/en/5x/api.html#req.query

// HANDLERS HELP
// https://handlebarsjs.com/guide/#what-is-handlebars


// *****************************************************************************
// EXPRESS WEBSERVER IMPORT
// MAIN/DEFAULT WEB SERVER PARAMETERS
import express from "express";
const app = express();
const PORT = 3000;    // Sets default website port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
const WEB = "web";
app.use(express.static(WEB, {    // Like "Default Document" on ISS
  index: ["index.html"]
}));

// ADDITIONAL WEB SERVER PARAMETERS 
// Suteikia funkcionaluma automatiskai iskaidyti URL'e esancius parametrus
// i atskirus objektus. Visu ju vertes tekstines, todel skaitines reiksmes reikia
// konvertuotis i skaicius.
app.use(express.urlencoded({
  extended: true,
}));
// Suteikia galimybe duomenis konvertuoti i json formatą
app.use(express.json());
// *****************************************************************************
// HANDLEBARS FOR EXPRESS WEB SERVER IMPORT 
import handleBars from "express-handlebars";
app.engine('handlebars', handleBars());
app.set('view engine', 'handlebars');
// *****************************************************************************


// DATA IMPORT FROM EXTERNAL DATA FILE
import {zmones, nextId} from "../web/js/data/zmones.js";
let nextId2 = nextId;


// DATA RENDERING - (HTML RENDER ONLY)
app.get("/zmones", (req, res) => {
  res.render('zmones', {zmones});
});

// DELETING USER - (HTML RENDER AND DATA CHANGE)
app.get("/zmogusDelete", (req, res) => {
  const id = parseInt(req.query.id); //console.log(req.query);
  const index = zmones.findIndex(e => e.id === id);     // suranda masyve elementa pagal duota id
  //console.log(index);
  if (index >= 0) {
    zmones.splice(index, 1);    // istrina masyvo elementa pagal duota id/index
  }
  res.redirect("/zmones");
});

// EDITING USER - (HTML RENDER)
app.get("/zmogusEdit", (req, res) => {
  let zmogus;
  if (req.query.id) {
    // paima is url ID parametra ir pakonvertuoja i skaiciu.
    // req.query.id = url id parametras
    // parseint = convertavimas i skaiciu
    const id = parseInt(req.query.id);
    zmogus = zmones.find((e) => e.id === id);
    if (!zmogus) {
      res.redirect("/zmones");
      return
    }
  }
  // jei zmogus yra undefined - vadinasi kursim nauja
  // jei zmogus rodo i objekta - redaguosim
  res.render('zmogusEditSave', {zmogus});
})

// EDITING OR ADDING NEW USER (DATA CHANGE)
app.post("/zmogusSave", (req, res) => {
  let zmogus;
  // console.log(req.body);
  if (req.body.id) {
    const id = parseInt(req.body.id);
    zmogus = zmones.find((e) => e.id === id);
    // console.log(zmogus);
    if (!zmogus) {
      res.redirect('/zmones');
      return;
    }
  }
  let klaidos = [];
  if (!req.body.vardas || req.body.vardas.trim() === "") {
    klaidos.push("Vardas negali būti tuščias")
  }
  if (!req.body.pavarde || req.body.pavarde.trim() === "") {
    klaidos.push("Pavardė negali būti tuščia")
  }
  let alga = parseFloat(req.body.alga);
  if (isNaN(alga)) {
    klaidos.push("Neteisingai įvesta alga");
  }

  // render errors
  if (klaidos.length > 0) {
    res.render('blogi-duomenys', {klaidos, zmogus});
  } else {
    if (zmogus) {
      zmogus.vardas = req.body.vardas;
      zmogus.pavarde = req.body.pavarde;
      zmogus.alga = req.body.alga;
    } else {
      zmones.push({
        id: nextId++,
        vardas: req.body.vardas,
        pavarde: req.body.pavarde,
        alga
      });
    }
    res.redirect("/zmones");
  }
});



// ************************************* FOR FRONTEND ****************************************
// DATA EXPORT IN JSON FORMAT
app.get('/json/zmones', (req, res) => {
  res.set('Content-Type', 'application/json');  // pakeičia turinio tipą į json
  res.send(JSON.stringify(zmones)); //converts zmones object to json and sends as response
})

// DELETE RECORD
app.delete('/json/zmones/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = zmones.findIndex((e) => e.id === id);
  if (index >= 0) {
    zmones.splice(index, 1);
  }
  // response code indicates that a request has succeeded, but that the client doesn't need to navigate away from its current page.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
  res.status(204).end();
})

// ADD NEW RECORD
app.post('/json/zmones', (req, res) => {
  zmones.push({
    id: nextId2++,
    vardas: req.body.vardas,
    pavarde: req.body.pavarde,
    alga: req.body.alga,
    gimimo_metai: req.body.gimimo_metai,
    telefonas: req.body.telefonas,
    adresas: req.body.adresas
  })
  res.status(204).end();
})

// EDIT RECORD
app.put('/json/zmones', (req, res) => {
    const id = parseInt(req.body.id);
    const zmogus = zmones.find((e) => e.id === id);
    if (zmogus) {
      zmogus.vardas = req.body.vardas;
      zmogus.pavarde = req.body.pavarde;
      zmogus.alga = req.body.alga;
      zmogus.gimimo_metai = req.body.gimimo_metai;
      zmogus.telefonas = req.body.telefonas;
      zmogus.adresas = req.body.adresas;
      res.status(204).end();
    } else {
      // response code indicates that the server can't find the requested resource
      res.status(404).end();
    }
    
})



// *****************************************************************************
// TEST INFO
// app.get("/labas", (req, res) => {
//   console.log(req.ip);
//   console.log(req.method);
//   console.log(req.path);
//   console.log(req.query);
//   res.send("labas");
// });