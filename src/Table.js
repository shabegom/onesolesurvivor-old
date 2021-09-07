import React, { useContext, useState, useEffect } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { FirebaseContext } from "./Firebase";

const leaderStyle = {
  textAlign: "center",
  marginTop: "10px",
  textDecoration: "bold",
  fontSize: "1.3rem",
  fontFamily: "survives"
};

const leaderNameStyle = {
  fontSize: "1.2rem",
  fontFamily: "arial"
};

const createTribalsColumns = (count) => {
  let finalArr = [];
  const recur = () => {
    if (count !== 0) {
      let tribalNum = count;
      finalArr.unshift({
        key: `tribal-${tribalNum}`,
        Header: "Tribal " + count,
        accessor: "tribal-" + tribalNum,
        width: 90
      });
      count--;
      recur(count);
    } else if (count === 0) {
      return;
    }
  };
  recur(count);
  return finalArr;
};

const Table = () => {
  const firebase = useContext(FirebaseContext);
  const [tribals, setTribals] = useState([]);
  const [leader, setLeader] = useState(undefined);
  const [data, setData] = useState([]);
  const [finalTribal, setFinalTribal] = useState(false);
  useEffect(() => {
    firebase.db.get.getRoot().once("value", (snap) => {
      let { teams = [], tribals = [] } = snap.val();
      if (teams) {
        teams = teams.map((team) => {
          let totalPoints = 0;
          let eliminated = [];
          let picks = [];
          tribals.forEach((tribal) => {
            if (tribal.value === "final-tribal") {
              setFinalTribal(true);
            }
            if (tribal.eliminated) {
              eliminated.push(tribal.eliminated);
            }
            if (tribal.teams) {
              tribal.teams.forEach((teamScore) => {
                if (team.name === teamScore.name) {
                  team[tribal.value] = teamScore.points;
                  totalPoints += teamScore.points;
                }
              });
            }
          });
          tribals = tribals.filter(tribal => tribal.value !== 'final-tribal')
          setTribals(tribals);
          team.picks.forEach((pick) => {
            if (eliminated.flat().includes(pick)) {
              picks.push(
                <span key={pick} className='eliminated-pick'>
                  {toTitleCase(pick.split("-")[0])}
                </span>,
                " "
              );
            } else {
              picks.push(<span key={pick}>{toTitleCase(pick.split("-")[0])}</span>, " ");
            }
          });
          team.totalPoints = totalPoints;
          team.picks = picks;
          team.key = team.id
          return team;
        });
        setData(teams);
        const leaders = teams.reduce((acc, team) => {
          if (acc.length === 0) {
            acc.push(team);
          }
          acc.forEach((a, i) => {
            if (team.totalPoints > a.totalPoints) {
              let newLeader = acc.splice(i, 1, team);
              acc = newLeader;
            }
            if (a.id !== team.id && a.totalPoints === team.totalPoints) {
              acc.push(team);
            }
          });
          return acc;
        }, []);
        if (leaders.length === 1) {
          setLeader(<p key={leaders[0].name}>{leaders[0].name}</p>);
        }
      }
    });
  }, []);
  const tableSize = data.length + 1;
  const columnArr = createTribalsColumns(tribals.length);
  const columns = [
    { Header: "Team", key: 'name', accessor: "name", width: 180, className: "team" },
    { Header: "Picks", key: 'picks', accessor: "picks", width: 250, className: "picks" },
  ];
  if (tribals.length > 0) {
    columns.push({
      Header: "Total",
      key: 'total-score',
      accessor: "totalPoints",
      width: 70
    }, ...columnArr);
  }
  if (finalTribal) {
    columns.push({
      Header: "Final Tribal",
      key: 'final-tribal',
      accessor: "final-tribal",
      width: 120
    });
  }
  return (
    <div className={"leaderboard"}>
      <div className='leader' style={leaderStyle}>
        Current Leader: {`  `}
        {leader ? (
          <span style={leaderNameStyle}>{leader}</span>
        ) : (
          <em style={leaderNameStyle}>There Can only be one!</em>
        )}
      </div>
      <ReactTable
        key='leaderboard'
        className={"-highlight -striped"}
        defaultPageSize={tableSize}
        showPagination={false}
        data={data}
        columns={columns}
      />
    </div>
  );
};

export default Table;

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
