import React, {useContext, useState, useEffect} from 'react'
import Table from './Table'
import Tribes from './Tribes'
import Summary from './Summary'
import Rules from './Rules'
import Eliminated from './Eliminated'
import LoginModal from './Modal'
import { FirebaseContext } from './Firebase'

const Home = ({ tribals, leader, tableData, summary, tribes, castaways }) => {
    const firebase = useContext(FirebaseContext)
    const [started, setStarted] = useState(false)
    useEffect(() => {
        firebase.db.get.getState().once('value', snap => {
            const {started} = snap.val()
            setStarted(started)
        })
    }, [])
    return (
            <div
                className="home"
                style={{
                    paddingLeft: '10%',
                    paddingRight: '10%'
                }}
        >
            <LoginModal />
            {started ?
                <>
                <Table
                    tribals={tribals}
                    leader={leader}
                    data={tableData}
                />
                                 <br />
                    <Summary summary={summary} />
                    </>
                : ""
            }

                <br />
                <Tribes tribes={tribes} />
                <br />
                <Eliminated castaways={castaways} />
                <br />
                <Rules />
            </div>
        )
    
}

export default Home
