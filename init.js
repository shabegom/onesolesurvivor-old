//
//
// Setup for OneSoleSurvivor Classic
// 1. Enter tribe names (line 25)
// 2. Enter castaway's tribe (line 74)
//
//
//
let fs = require("fs");
let file = "./winners-at-war.csv";
const csv = require("csvtojson");
let teamFile = "./teams.csv";

console.log("...running");

let state = {
  hasIdol: "",
  merged: false,
  numTribes: 2
};

let teams = {};

let tribes = {};
let tribals = {};
let finalObj = {};
let castaways = {};
tribes[0] = {
  tribeName: "Sele",
  castaways: [],
  names: [],
  eliminated: []
};
tribes[1] = {
  tribeName: "Dakal",
  castaways: [],
  names: [],
  eliminated: []
};

const generateTribals = count => {
  let obj = {};
  for (let i = 3; i <= count; i++) {
    obj[i] = {
      complete: false,
      label: `Tribal ${i}`,
      value: `tribal-${i}`
    };
  }
  return obj;
};

csv()
  .fromFile(teamFile)
  .then(obj => {
    console.log("parsed teams");
    obj.forEach((o, i) => {
      console.log(o);
      teams[i] = {
        isLeader: false,
        name: o.player,
        picks: {
          0: o.pickOne,
          2: o.pickThree,
          1: o.pickTwo,
          3: o.random
        },
        points: 0,
        totalPoints: 0,
        value: `team-${i + 1}`
      };
    });
  });

csv()
  .fromFile(file)
  .then(obj => {
    console.log("parsed castaways");
    obj.forEach((o, i) => {
      if (o.tribe === "Sele") {
        tribes[0].castaways.push(o.value);
        tribes[0].names.push(o.label);
        tribes[0].eliminated.push(o.eliminated);
      } else if (o.tribe === "Dakal") {
        tribes[1].castaways.push(o.value);
        tribes[1].names.push(o.label);
        tribes[1].eliminated.push(o.eliminated);
      }
    });
    obj.forEach((o, i) => (castaways[i] = o));
    finalObj["teams"] = teams;
    finalObj["castaways"] = castaways;
    finalObj["state"] = state;
    finalObj["tribes"] = tribes;
    finalObj["tribals"] = generateTribals(14);
    let json = JSON.stringify(finalObj);
    console.log("writing file");
    fs.writeFileSync("./init.json", json, () => console.log("file written"));
  });
