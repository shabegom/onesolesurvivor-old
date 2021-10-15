import React, {useState, useEffect} from "react"
import Table from "./Table"
import Tribes from "./Tribes"
import Summary from "./Summary"
import Rules from "./Rules"
import Eliminated from "./Eliminated"
import LoginModal from "./Modal"
import ChoosePicks from "./ChoosePicks"


const Home = ({ root }) => {
  const [started, setStarted] = useState("closed")
  
  useEffect(() => {
    setStarted(root.state.started)
  }, [root])

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
        <ChoosePicks teams={root.teams} castaways={root.castaways} />
      ) : (
        <>
          <Table root={root} />
          <br />
          <Summary root={root} />
        </>
      )}

      <br />
      <Tribes root={root} />
      <br />
      <Eliminated root={root} />
      <br />
      <Rules />
    </div>
  )
}

export default Home
