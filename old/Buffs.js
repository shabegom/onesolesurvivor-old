import React, { Component } from 'react';
import { Select, Input } from 'formsy-react-components'
import { castawaysMultiSelect } from './data.js'

class Buffs extends Component {
	render() {
const displayBuffs = () => {
const children = [];
        for (var i = 0; i < this.props.numTribes; i += 1) {
            children.push(<Tribe number={i} id={i} />);
        };
	return (
		<div className="buffs">
	<input type="button" className="btn btn-standard" name="new-tribe" onClick={this.props.addTribe} defaultValue="New Tribe" />
	<input type="button" className="btn btn-alert" name="remove-tribe" onClick={this.props.removeTribe} defaultValue="Remove Tribe" />
		{children}
		</div>
	)
}

		return (
			<div>
			<input type="checkbox" name="buffs" value= { this.props.buffs }  onChange={this.props.buffsChange}/> Drop your buffs? <br />
			{ this.props.buffs ? displayBuffs() : "" }
			</div>
		)
	}
}

class Tribe extends Component {
	render() {
		return (
			<div>
			                <Input
                    name={"tribe-name-" + this.props.number}
                    value=""
                    type="text"
                    placeholder="Tribe Name"
                />
				                <Select
                    name={"tribe-members-" + this.props.number}
                    options={castawaysMultiSelect}
					help="hold command to choose multiple"
                    multiple
				/>
			</div>
		);
	}
}

export default Buffs
