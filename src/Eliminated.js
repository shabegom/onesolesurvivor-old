import React, { useState,  useEffect } from "react";

const Eliminated = ({root}) => {

    const [castaways, setCastaways] = useState([])
    useEffect(() => {

            let { castaways=[], tribals=[] } = root

                castaways = castaways.filter((castaway) => {
                  let include = false;
                  tribals.forEach((tribal) => {
                    if (tribal.eliminated && tribal.eliminated.includes(castaway.value)) {
                      include = true;
                    }
                  });
                  return include;
                });
            setCastaways(castaways)

    }, [castaways])
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
        let name = castaway.label;
        let imageName = castaway.value;
          let imagePath
          try {
              imagePath = require(`./images/${imageName}.webp`);
            
          }
          catch (e) {
              imagePath = require(`./images/placeholder.PNG`);
          }
        nameArray.push(
          <div key={castaway.value} className='castaway'>
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
    });
  }
  return nameArray;
};
export default Eliminated;
