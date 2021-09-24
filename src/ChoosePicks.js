import React, { useContext, useState, useEffect } from "react";
import { Form, Input, Select } from "formsy-react-components";
import { castawaysDropDown } from "./data";
import { FirebaseContext } from "./Firebase";

const ChoosePicks = () => {
  const [isSaved, setSaved] = useState(false);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    firebase.db.get.getTeams().once("value", snap => {
      const { currentUser } = firebase.auth.auth;
      const teams = snap.val() || []
      teams.forEach(team => {
        if (currentUser.uid === team.id) {
          setSaved(true)
        }
      })
    })
  }, [isSaved])
  const handlePicksFormSubmit = (data) => {
    const { currentUser } = firebase.auth.auth;
    const teamObject = {
      name: data.team,
      picks: [data["pick-1"], data["pick-2"], data["pick-3"]],
      id: currentUser.uid
    };
    teamObject.picks.push(randomPick(castawaysDropDown, teamObject.picks))
    firebase.db.get.getTeams().once("value", (snap) => {
      const teams = snap.val() || []
      const existingTeam = teams.reduce((acc, team, index) => {
        if (team.id === currentUser.uid) {
          acc = index;
        }
        return acc;
      }, undefined);
      teamObject.value = `team-${teams.length}`;
      if (existingTeam) {
        teams.splice(existingTeam, 1, teamObject);
        firebase.db.set.setTeams(teams)
        setSaved(true);
      } else {
        teams.push(teamObject);
        firebase.db.set.setTeams(teams)
        setSaved(true);
      }
    });
  };
  return (
    <>
      {!isSaved &&
        <div>
          <div className='login-modal-subhead'>
            Hello! Thanks for signing up to play. Choose a team name and pick your
            castaways. We'll contact you for payment. The game begins after Episode 2
            airs.</div>
          <Form onSubmit={(data) => handlePicksFormSubmit(data)}>
            <Input
              name='team'
              label='Team Name'
              placeholder='Choose a team name'
              required
              value=''
            />
            <Select
              name='pick-1'
              label='First Pick'
              options={castawaysDropDown}
              required
            />
            <Select
              name='pick-2'
              label='Second Pick'
              options={castawaysDropDown}
              required
            />
            <Select
              name='pick-3'
              label='Third Pick'
              options={castawaysDropDown}
              required
            />
            <input
              name='submit'
              type='submit'
              className='btn btn-primary'
              defaultValue='Save Picks!'
              value='Save Picks'
            />
          </Form>
        </div>
      }
      {isSaved && (
        <div className='flex-center'>
          <h2>Picks Saved!</h2>
          <p>Don't forget to send us your $20 buy in.</p>
          <p>Teams will be revealed when everyone's picks are in.</p>
          <p>you can contact us at: jeff@onesolesurvor.com</p>
        </div>
      )}
    </>
  );
};

export default ChoosePicks;
function randomPick(array = [], currentPicks = []) {
  const options = array.filter(pick => {
    let include = true
    currentPicks.forEach(choice => {
      if (pick.value === choice || pick.value === "clear" || pick.value === "sara-wilson" || pick.value === "eric-abraham") {
        include = false
      }
    })
    return include
  })
  if (options) {
    let pick = options[Math.floor(Math.random() * array.length)]
    return pick.value
  } else {
    return 'manual-pick'
  }
}