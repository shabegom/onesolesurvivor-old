import React, { Component } from "react";

export default class Rules extends Component {
  render() {
    return (
      <div
        id="rules"
        className="rules"
      >
        <h3 style={{  }}>Scoring</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "space-around",
            fontFamily: "Arial"
          }}
        >
          <div>
            <strong>1 POINT</strong> for each Survivor for staying in each week
          </div>
          <br />
          <div>
            <strong>5 POINTS</strong> for finding an IDOL
          </div>
          <br />
          <div>
            <strong>1 POINT</strong> for winning or buying and IDOL
          </div>
          <br />
          <div>
            <strong>5 POINTS</strong> for using an IDOL to save yourself
          </div>
          <br />
          <div>
            <strong>-10 POINTS</strong> for getting voted out with an IDOL in
            your pocket
          </div>
          <br />
          <div>
            <strong>5 POINTS</strong> for coming back from EXTINCTION
          </div>
          <br />
          <div>
            <strong>5 POINTS</strong> for reward win (after merge)
          </div>
          <br />
          <div>
            <strong>5 POINTS</strong> for immunity win (after merge)
          </div>
          <br />
          <div>
            <strong>5 POINTS</strong> for winning SURVIVOR!
          </div>
        </div>
      </div>
    );
  }
}
