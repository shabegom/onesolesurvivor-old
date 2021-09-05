import React, { Component } from "react";

export default class Tribes extends Component {
  render() {
    const makeTribeNames = tribe => {
      return tribe.castaways.map((name, i) => {
        // let imageName = name.toLowerCase().replace(/ /g, '-')
        let imagePath = require(`./images/${name}.jpg`);
        if (tribe.eliminated[i] === "FALSE") {
          return (
            <div className="castaway">
              <img
                alt={"castaway-" + i}
                src={imagePath}
                style={{
                  width: "75px",
                  filter: "drop-shadow(1px 0px 4px RGBA(76,60,75,1.00))"
                }}
              />{" "}
              <br />
              <div style={{fontFamily: "arial", textAlign: "center", fontSize: "12px", marginTop: "-20px"}}>{tribe.names[i]}</div>
            </div>
          );
        }
        return "";
      });
    };
    const makeTribes = tribes => {
      let finalTribeArray = [];
      tribes.forEach(tribe => {
        let tribeArray = [];
        tribeArray.push(
          <div>
            <h3>{tribe.tribeName}</h3>
            <hr />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {makeTribeNames(tribe)}
            </div>
          </div>
        );
        finalTribeArray.push(tribeArray);
      });
      return <div>{finalTribeArray}</div>;
    };
    return (
      <div
        id="tribes"
        className="tribes"
      >
    
        {makeTribes(this.props.tribes)}
      </div>
    );
  }
}
