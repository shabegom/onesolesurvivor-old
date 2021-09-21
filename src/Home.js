import React, { useContext, useState, useEffect } from "react";
import Table from "./Table";
import Tribes from "./Tribes";
import Summary from "./Summary";
import Rules from "./Rules";
import Eliminated from "./Eliminated";
import LoginModal from "./Modal";
import ChoosePicks from "./ChoosePicks";
import { FirebaseContext } from "./Firebase";

const Home = ({ summary}) => {
  const firebase = useContext(FirebaseContext);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    firebase.db.get.getState().once("value", (snap) => {
      const { started } = snap.val();
      setStarted(started);
    });
  }, []);
  return (
    <div
      className='home'
      style={{
        paddingLeft: "10%",
        paddingRight: "10%"
      }}
    >
      <LoginModal />
      {started === "closed" ? (
        <h1 style={{ textAlign: "center" }}>
          {" "}
          Season 41 starts September 22nd!
        </h1>
      ) : started === "open" ? (
        <ChoosePicks />
      ) : (
        <>
          <Table />
          <br />
          <Summary />
        </>
      )}

      <br />
      <Tribes/>
      <br />
      <Eliminated/>
      <br />
      <Rules />
    </div>
  );
};

export default Home;
