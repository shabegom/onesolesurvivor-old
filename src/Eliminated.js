import React, { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "./Firebase";
const Eliminated = () => {
    const firebase = useContext(FirebaseContext)
    const [castaways, setCastaways] = useState([])
    useEffect(() => {
        firebase.db.get.getRoot().once('value', snap => {
            let { castaways=[], tribals=[] } = snap.val()
            if (castaways) {
                castaways = castaways.filter((castaway) => {
                  let include = false;
                  tribals.forEach((tribal) => {
                    if (tribal.eliminated && tribal.eliminated.includes(castaway.value)) {
                      include = true;
                    }
                  });
                  return include;
                });
            }
            setCastaways(castaways)
        })
    }, [])
    return (
        <>
            {castaways[0] &&
                <div className='eliminated'>
                    <h3 style={{}}>Eliminated</h3>
                    <hr />
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        {makeElimNames(castaways)}
                    </div>
                </div>
            }
            </>
  );
};

const makeElimNames = (castaways) => {
  let nameArray = [];
  if (castaways) {
    castaways.forEach((castaway) => {
      if (castaway.eliminated === "TRUE") {
        let name = castaway.label;
        let imageName = castaway.value;
          let imagePath
          try {
              imagePath = require(`./images/${imageName}.jpg`);
            
          }
          catch (e) {
              imagePath = require(`./images/placeholder.PNG`);
          }
        nameArray.push(
          <div className='castaway'>
            <div style={{ background: "RGBA(0,0,0,.30)" }}>
              <img
                alt={"eliminated-castaway" + castaway.value}
                src={imagePath}
                style={{
                  width: "75px",
                  opacity: "0.3",
                  filter: "drop-shadow(1px 0px 4px #4444dd)"
                }}
              />{" "}
            </div>
            <div
              style={{
                fontFamily: "arial",
                textAlign: "center",
                fontSize: "12px"
              }}
            >
              {name}
            </div>
          </div>
        );
      }
    });
  }
  return nameArray;
};
export default Eliminated;
