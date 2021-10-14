import React from "react";
import { withFirebase } from "./Firebase";
import { withAuth } from "./Session";
import { compose } from "recompose";

const styles = {
  padding: "10px"
};

export default withFirebase(function Admin(props) {
  return <div style={styles}>{props.children}</div>;
});
