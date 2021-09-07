import React, { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "./Firebase";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const Summary = () => {
  const firebase = useContext(FirebaseContext);
  const [summary, setSummary] = useState([]);
  useEffect(() => {
    firebase.db.get.getTribals().once("value", (snap) => {
      const tribals = snap.val() || []
      const summaries = tribals
        .filter((tribal) => tribal.summary)
          .map((tribal) => tribal.summary);
        setSummary(summaries)
    });
  });
  return (
    <div className='summary'>
      <div
        style={{
          background: "RGBA(248,247,217,0.01)",
          padding: "10px",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <h3 style={{}}>Last Episode</h3>
        {summary[0]
          ? buildSummary(summary)
          : "A summary of the last tribal will be posted here once we've started."}
      </div>
    </div>
  );
};

const buildSummary = (summary) => {
  let finalArr = [];
  let lastElement = summary[summary.length - 1];
  if (lastElement) {
    let eliminated = lastElement.eliminated;
    finalArr.push(
      <p key="eliminated">
        {toTitleCase(eliminated.join("-").split("-").join(" "))} was eliminated
        😢
      </p>
    );
    if (lastElement.idolFound) {
      lastElement.idolFound.forEach((idol) => {
        finalArr.push(
          <p key="idolFound">
            {toTitleCase(idol.split("-").join(" "))} found an Idol (5 points) 🥇
          </p>
        );
      });
    }
    if (lastElement.idolWon) {
      lastElement.idolWon.forEach((idol) => {
        finalArr.push(
          <p key="idolWon">
            {toTitleCase(idol.split("-").join(" "))} Won an Idol (+1 point) 🥇
          </p>
        );
      });
    }
    if (lastElement.immunity) {
      let immunityWinner = lastElement.immunity.join("-");
      finalArr.push(
        <p key="immunity">
          {toTitleCase(immunityWinner.split("-").join(" "))} won Immunity (+5
          points) 📿
        </p>
      );
    }
    if (lastElement.reward) {
      finalArr.push(<p key="reward">Reward Winners (+5 points):</p>);
      finalArr.push(
        lastElement.reward.map((r) => {
          return (
            <li key={r} style={{ marginLeft: "30px" }}>
              {toTitleCase(r.split("-").join(" "))} won Reward (+5 points) 🍔
            </li>
          );
        })
      );
    }
    if (lastElement.idolActions) {
      finalArr.push(<p key="idolActions">Used Idols:</p>);
      finalArr.push(
        lastElement.idolActions.map((object) => {
          let action;
          if (object.action === "voted-out") {
            action = "Was voted out with an Idol! (-10 points) 😱";
          }
          if (object.action === "saved-self") {
            action = "Saved by their idol (+5 points) 🎉";
          }
          if (object.action === "burned") {
            action = "Burned their idol (0 points) 🔥";
          }
          return (
            <li key={object.value} style={{ marginLeft: "30px" }}>
              {toTitleCase(object.value.split("-").join(" "))}: {action}
            </li>
          );
        })
      );
    }
  }
  return finalArr;
};

export default Summary;
