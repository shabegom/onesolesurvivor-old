import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

const leaderStyle = {
  textAlign: "center",
  marginTop: "10px",
  textDecoration: "bold",
  fontSize: "2rem",
  fontFamily: "yoz"
};

const leaderNameStyle = {
  color: "RGBA(233,227,201,1.00)",
  fontSize: "1.4rem",
  fontFamily: "survives"
};

const createTribalsColumns = count => {
  let finalArr = [];
  const recur = () => {
    if (count !== 0) {
      let tribalNum = count + 2;
      finalArr.unshift({
        Header: "Tribal " + tribalNum,
        accessor: "tribal-" + tribalNum
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

export default class Table extends Component {
  render() {
    let columnArr = createTribalsColumns(17);
    let columns = [
      { Header: "Team", accessor: "name", width: 180 },
      { Header: "Picks", accessor: "picks", width: 300 },
      { Header: "Total", accessor: "totalPoints" },
      ...columnArr,
      { Header: "Final Tribal", accessor: "tribal-20" }
    ];
    return (
      <div id="lb">
        <div style={leaderStyle}>
          Current Leader <br />
          {this.props.leader ? (
            <span className="leader" style={leaderNameStyle}>
              {this.props.leader}
            </span>
          ) : (
            <em style={leaderNameStyle}>There Can only be one!</em>
          )}
        </div>
        <ReactTable
          className={"-highlight -striped"}
          defaultPageSize={15}
          showPagination={false}
          data={this.props.data}
          columns={columns}
        />
      </div>
    );
  }
}
