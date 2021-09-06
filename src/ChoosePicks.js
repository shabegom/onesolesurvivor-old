import React from 'react';
import { Form, Input } from "formsy-react-components";


const ChoosePicks = ({ display }) => {
    return display ? (
        <div className="login-modal-subhead">
            Hello New User! Choose a team name and pick your castaways
            <Form>
                <Input
                    name="team"
                    placeholder="Choose a team name"
                    required
                    value=""
                />
            </Form>
        </div>
    ) : ("")
}

export default ChoosePicks