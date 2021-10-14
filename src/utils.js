/* eslint-disable */

import { castawaysMultiSelect, teams } from "./data.js";

export const processFormObject = form => {
  console.log(form);
  const {
    merged,
    tribal,
    eliminated,
    extinction,
    idolFound,
    idolWon,
    immunity,
    reward
  } = form;

  //required fields
  if (!eliminated || !tribal) {
    alert("you need to provide values for tribal and eliminated");
  } else {
    //Now we start setting up the different pointChecker functions.
    let pointRules = [];
    eliminated
      ? eliminated.forEach(person =>
          pointRules.push({ selected: person, value: 1, gainOrLoss: "loss" })
        )
      : "";
    immunity
      ? immunity.forEach(person =>
          pointRules.push({ selected: person, value: 5, gainOrLoss: "gain" })
        )
      : "";
    extinction
      ? extinction.forEach(person =>
          pointRules.push({ selected: person, value: 5, gainOrLoss: "gain" })
        )
      : "";
    idolFound
      ? idolFound.forEach(person =>
          pointRules.push({ selected: person, value: 5, gainOrLoss: "gain" })
        )
      : "";
      idolWon
      ? idolWon.forEach(person =>
          pointRules.push({ selected: person, value: 1, gainOrLoss: "gain" })
        )
      : "";
    reward
      ? reward.forEach(person =>
          pointRules.push({ selected: person, value: 5, gainOrLoss: "gain" })
        )
      : "";
    const idolActions = createIdolObject(form);
    pointRules = pointRules.concat(idolActions);
    const buffDrops = createTribeObject(form);
    const pointFuncs = pointRules.map(rule => {
      const { selected, value, gainOrLoss } = rule;
      //return a pointChecker using the options in pointRules
      return createPointChecker(selected, value, gainOrLoss);
    });
    //stupid object
    const o = {};
    //All of our pointChecker functions are in an array
    // We map each function agains the entire list of castaways
    // If a castaway on the list equals the value arg of the pointChecker record a point object
    // Add extinction castaway
    //
    if (extinction) {
      let returnedCastaways = extinction.map(c => ({ value: c }));
      castawaysMultiSelect.push(...returnedCastaways);
    }
    const points = pointFuncs
      .map(func => castawaysMultiSelect.map(c => func(c.value)))
          // Remove any zero point values
      .map(point => removeZero(point))
      .reduce((a, b) => a.concat(b))
      //add up all the points
      .reduce((r, e) => addPoints(r, e, o), []);
    //get team scores from points
    let teamsScores = calculateTeamScores(teams, points);
    //handle a castaway using an idol
    let idolActioners = idolActions.map(action => {
      return { value: action.selected, action: action.type };
    });
    //the return object
    let obj = {};
    if (immunity) {
obj["immunity"] = immunity;
    }
    if (reward) {
      obj["reward"] = reward;
}

    obj["eliminated"] = eliminated;
    obj["extinction"] = extinction ? extinction : [];
    obj["complete"] = true;
    obj["value"] = tribal;
    obj["num"] = tribal.split("-")[1]
    obj["points"] = Object.assign({}, points);
    obj["tribes"] = buffDrops;
    obj["teams"] = Object.assign({}, teamsScores);
    obj["summary"] = { eliminated };
    obj["merged"] = merged;
    obj["idolUsers"] = idolActioners.map(actioner => actioner.value);
    obj["foundIdol"] = idolFound ? idolFound : [];
    obj["wonIdol"] = idolWon ? idolWon : [];
    idolFound ? (obj.summary["idolFound"] = idolFound) : "";
    idolWon ? (obj.summary["idolWon"] = idolWon) : "";
    immunity ? (obj.summary["immunity"] = immunity) : "";
    reward ? (obj.summary["reward"] = reward) : "";
    idolActioners ? (obj.summary["idolActions"] = idolActioners) : "";
    return obj;
  }
};

const calculateTeamScores = (teams, points) => {
  teams.forEach(team => {
    let teamPoints = 0;
    team.picks.forEach(pick => {
      points.map(p => {
        if (p.castaway === pick) {
          teamPoints += p.points;
        }
      });
    });
    team.points = teamPoints;
  });
  return teams;
};

const removeZero = point => {
  let filtered = point.filter(p => {
    if (p.points !== 0) {
      return p;
    }
  });
  return filtered;
};

const addPoints = (r, e, o) => {
  const key = e.castaway;
  if (!o[key]) {
    o[key] = e;
    r.push(o[key]);
  } else {
    o[key].points += e.points;
  }
  return r;
};

const createIdolObject = form => {
  const keys = Object.keys(form);
  const idolActions = keys.filter(key => key.includes("idolAction"));
  const actionArr = [];
  idolActions.forEach(action => {
    let value = form[action];
    let person = action
      .split("-")
      .slice(1, 3)
      .join("-");
    if (value === "voted-out") {
      actionArr.push({
        selected: person,
        value: -10,
        gainOrLoss: "gain",
        type: "voted-out"
      });
    } else if (value === "saved-self") {
      actionArr.push({
        selected: person,
        value: 5,
        gainOrLoss: "gain",
        type: "saved-self"
      });
    } else if (value === "burned") {
      actionArr.push({
        selected: person,
        value: 0,
        gainOrLoss: "gain",
        type: "burned"
      });
    }
  });
  return actionArr;
};

const createTribeObject = form => {
  const tribeArr = [];
  const tribeNameKeys = Object.keys(form).filter(key =>
    key.includes("tribe-name")
  );
  tribeNameKeys.forEach((key, i) => {
    let tribeObject = {};
    let value = form["tribe-members-" + i];
    let tribeName = form[key];
    tribeObject["tribeName"] = tribeName;
    tribeObject["castaways"] = value;
    tribeArr.push(tribeObject);
  });
  return tribeArr;
};

const createPointChecker = (selected, points, gainOrLoss) => value => {
  const pointsObj = {};
  if (gainOrLoss === "gain") {
    if (value === selected) {
      pointsObj["castaway"] = value;
      pointsObj["points"] = points;
      return pointsObj;
    } else {
      pointsObj["points"] = 0;
      return pointsObj;
    }
  } else if (gainOrLoss === "loss") {
    if (value === selected) {
      pointsObj["points"] = 0;
      return pointsObj;
    } else {
      pointsObj["castaway"] = value;
      pointsObj["points"] = points;
      return pointsObj;
    }
  }
};
