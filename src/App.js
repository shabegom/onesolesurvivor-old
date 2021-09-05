import React, { Component } from "react";
import "./global.css";

import { BrowserRouter as Router, Route } from "react-router-dom";

import castaways, { CastawaysContext } from "./Castaways";

// Dumb Components
import Header from "./Header.js";
import Footer from "./Footer.js";

// Main Page
import Home from "./Home.js";

//Admin Page
import Login from "./Login.js";
import MainForm from "./MainForm.js";

//Helper functions
import { processFormObject } from "./utils.js";
import {
  // getState,
  // handleIdolFound,
  // setMerged,
  setTribal,
  setTeams,
  setTribes,
  getRoot
} from "./async.js";

const pageStyle = {
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      showLogin: true,
      loggedIn: false,
      failed: false,
      merged: false,
      buffs: false,
      hasIdol: [],
      numTribes: 2,
      fireRedirect: false,
      tableData: [],
      leader: "",
      tribes: [],
      castaways: "",
      summary: {}
    };

    getRoot.once("value", snapshot => {
      let root = snapshot.val();
      let { castaways, state, teams, tribals, tribes } = root;
      let { hasIdol, merged, numTribes } = state;
      let leader;
      let finalArr = [];
      let summaries = tribals
        .filter(tribal => tribal.summary)
        .map(tribal => tribal.summary);

      let totalPoints = teams.map(team => {
        return team.totalPoints;
      });
      let highscore = totalPoints.reduce((prev, current) => {
        return current > prev ? current : prev;
      });

      //get tribal data into the table array
      let possibleLeaders = [];
      teams &&
        teams.forEach(team => {
          if (team.totalPoints === highscore && team.totalPoints !== 0) {
            possibleLeaders.push(team.name);
          }
          let pickNames = [];
          let teamObj = {};
          tribes &&
            tribes.forEach(tribe => {
              let isEliminated = [];
              let castawayNames = [];
              castaways &&
                castaways.forEach(castaway => {
                  tribe &&
                    tribe.castaways.forEach(value => {
                      if (castaway.value === value) {
                        isEliminated.push(castaway.eliminated);
                        castawayNames.push(castaway.label);
                      }
                    });
                });
              tribe["eliminated"] = isEliminated;
              tribe["names"] = castawayNames;
            });

          castaways &&
            castaways.forEach(castaway => {
              team &&
                team.picks.forEach(pick => {
                  if (pick === castaway.value) {
                    if (castaway.eliminated === "TRUE") {
                      pickNames.push(
                        <span
                          style={{
                            color: "RGBA(145,147,134,.30)",
                            filter: "none"
                          }}
                        >
                          {castaway.label.split(" ")[0]}
                        </span>,
                        " "
                      );
                    } else {
                      pickNames.push(castaway.label.split(" ")[0], " ");
                    }
                  }
                });
            });
          teamObj["name"] = team.name;
          teamObj["totalPoints"] = team.totalPoints;
          teamObj["picks"] = pickNames;
          tribals.forEach(tribal => {
            if (tribal.teams) {
              tribal.teams.forEach(tribalTeam => {
                if (team.value === tribalTeam.value) {
                  teamObj[tribal.value] = tribalTeam.points;
                }
              });
            }
          });
          finalArr.push(teamObj);
        });
      if (possibleLeaders.length === 1) {
        leader = possibleLeaders[0];
      }

      this.setState({
        hasIdol,
        merged,
        numTribes,
        leader,
        tableData: finalArr,
        castaways,
        tribes,
        tribals,
        summary: summaries
      });
    });
  }

  handleLogin = () => this.setState({ loggedIn: true, showLogin: false });

  render() {
    const processForm = formData => {
      const points = processFormObject(formData);
      if (points) {
        setTribal(points);
        setTeams(points);
        setTribes(points);
        this.setState({ fireRedirect: true });
      }
    };

    const baseUrl = process.env.PUBLIC_URL;

    return (
      <div className="App" style={pageStyle}>
        <Header />
        <CastawaysContext.Provider value={castaways}>
          <Router>
            <div>
              <Route
                exact={true}
                path={baseUrl + "/"}
                render={props => (
                  <Home
                    summary={this.state.summary}
                    tribes={this.state.tribes}
                    leader={this.state.leader}
                    tableData={this.state.tableData}
                    tribals={this.state.tribals}
                    castaways={this.state.castaways}
                  />
                )}
              />
              <Route
                exact={true}
                path={baseUrl + "/admin"}
                render={props => (
                  <div style={{ padding: "10px" }}>
                    <Login />
                    <MainForm
                      processForm={processForm}
                      fireRedirect={this.state.fireRedirect}
                      merged={this.state.merged}
                      hasIdol={this.state.hasIdol}
                    />
                  </div>
                )}
              />
            </div>
          </Router>
        </CastawaysContext.Provider>
        <Footer />
      </div>
    );
  }
}

export default App;
