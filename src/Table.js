import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

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
      let tribalNum = count + 2;
      finalArr.unshift({
        Header: "Tribal " + tribalNum,
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

const Table = ({tribals, leader, data}) => {
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
              <span className="leader" style={leaderNameStyle}>
                {leader}
              </span>
            ) : (
              <em style={leaderNameStyle}>There Can only be one!</em>
            )}
          </div>
          <ReactTable
            className={"-highlight -striped"}
            defaultPageSize={15}
            showPagination={false}
            data={data}
            columns={columns}
          />
        </div>
    );
  }

export default Table;