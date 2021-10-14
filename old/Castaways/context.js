import React from "react";

const CastawaysContext = React.createContext(null);

export const withCastaways = Component => props => (
  <CastawaysContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </CastawaysContext.Consumer>
);

export default CastawaysContext;
