
import React from 'react'

class Eliminated extends React.Component {
    render() {
        const makeElimNames = castaways => {
            let nameArray = []
            if (castaways) {
                castaways.forEach(castaway => {
                    if (castaway.eliminated === 'TRUE') {
                        let name = castaway.label
                        let imageName = castaway.value
                        let imagePath = require(`./images/${imageName}.jpg`)
                        nameArray.push(
                            <div className="castaway">

                                <div style={{background: 'RGBA(0,0,0,.30)', }}>
                                <img
                                    alt={'eliminated-castaway'+castaway.value}

                                    src={imagePath}
                                    style={{ width: '75px', opacity: '0.3', filter: 'drop-shadow(1px 0px 4px #4444dd)' }}
                                />{' '}
                                </div>
                                <div style={{fontFamily: "arial", textAlign: "center", fontSize: "12px" }}>
                                    {name}
                                    </div>

                            </div>
                        )
                    }
                })
            }
            return nameArray
        }

        return (
            <div
            className="eliminated"
            >
                <h3 style={{}}>Eliminated</h3>
                <hr />
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {makeElimNames(this.props.castaways)}
                </div>
            </div>
        )
    }
}

export default Eliminated
