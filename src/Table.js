import React, {useContext, useState, useEffect} from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {FirebaseContext} from './Firebase'

const leaderStyle = {
  textAlign: "center",
  marginTop: "10px",
  textDecoration: "bold",
  fontSize: "1.3rem",
  fontFamily: "survives",
};

const leaderNameStyle = {
  fontSize: "1.2rem",
  fontFamily: "arial"
};

const createTribalsColumns = count => {
  let finalArr = [];
  const recur = () => {
    if (count !== 0) {
      let tribalNum = count - 1
      finalArr.unshift({
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
  const firebase = useContext(FirebaseContext)
  const [tribals, setTribals] = useState([])
  const [leader, setLeader] = useState(undefined)
  const [data, setData] = useState([])
  useEffect(() => {
    firebase.db.get.getRoot().once("value", snap => {
      let { teams, tribals } = snap.val()
      tribals && setTribals(tribals)
      if (teams) {
       teams = teams.map((team) => {
         let totalPoints = 0;
         tribals.forEach((tribal) => {
           if (tribal.teams) {
             tribal.teams.forEach((teamScore) => {
               if (team.name === teamScore.name) {
                 team[tribal.value] = teamScore.points;
                 totalPoints += teamScore.points;
               }
             });
           }
         });
         team.totalPoints = totalPoints;
         return team;
       });
       setData(teams);
       const leaders = teams.reduce((acc, team) => {
         if (acc.length === 0) {
           acc.push(team);
         }
         acc.forEach((a, i) => {
           if (a.totalPoints < team.totalPoints) {
             acc = acc.splice(i, 1, team);
           }
           if (a.totalPoints === team.totalPoints) {
             acc.push(team);
           }
         });
         return acc;
       }, []);
       if (leaders.length === 1) {
         setLeader(leaders[0]);
       }
     }
    })
  }, [])
    const tableSize = data.length + 1
    const columnArr = createTribalsColumns(tribals.length);
    const columns = [
      { Header: "Team", accessor: "name", width: 180, className: "team" },
      { Header: "Picks", accessor: "picks", width: 250, className: "picks" },
      { Header: "Total", accessor: "totalPoints", width: 70 },
      ...columnArr,
      { Header: "Final Tribal", accessor: "tribal-20", width: 120 }
    ];
    return (
        <div className={'leaderboard'}>
          <div className="leader"style={leaderStyle}>
            Current Leader:  {`  `}
            {leader ? (
              <span style={leaderNameStyle}>
                {leader}
              </span>
            ) : (
              <em style={leaderNameStyle}>There Can only be one!</em>
            )}
          </div>
          <ReactTable
            className={"-highlight -striped"}
            defaultPageSize={tableSize}
            showPagination={false}
            data={data}
            columns={columns}
          />
        </div>
    );
  }

export default Table;