import React, { Component } from 'react';
import { idolActions } from './data.js'
import { Select } from 'formsy-react-components'

class Idols extends Component {
	render() {

        // TODO: handle getting and idol and using it in the same episode //
const handleIdol = () => {
	let idols = this.props.hasIdol.map(( castaway, i ) => {
		return (
			<div key={i} >
			{ castaway.label }
				                <Select
                    name={"idolAction-" + castaway.value}
                    options={idolActions}
                />
			</div>
		)

	})
	return (
		<div>
        {idols[0] ? <h3>Did anyone use their idol?</h3> : ''}
        <p><strong>If a person has more than one idol, please use the lowest idol entry</strong></p>
			{ idols }
		</div>
    )

}
		return (
			<div>
			{ this.props.hasIdol ? handleIdol() : ""}
			</div>
		);
	}
}

export default Idols
