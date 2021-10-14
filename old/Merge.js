import React, { Component } from 'react';
import { castawaysMultiSelect, castawaysDropDown } from './data.js'
import { Select } from 'formsy-react-components'

class Merge extends Component {
	render() {
const displayMerged = () => {
	return (
		<div className="merged">
				                <Select
                    name="immunity"
                    label="Who won immunity?"
                    options={castawaysDropDown}
                    required
                />
				                <Select
                    name="reward"
                    label="Who won the reward?"
                    options={castawaysMultiSelect}
					help="hold command to choose multiple"
                    multiple
                    onChange={this.props.idolChange}
				/>
		</div>
	)
}
const displayCheck = (value) => {
    return (
        <div>
			<input type="checkbox" name="merge" checked= {this.props.merged} value= { this.props.merged }  onChange={this.props.mergeChange}/> Made it to the merge? <br />
        </div>
    )
}
		return (
			<div>
            { displayCheck(this.props.merged)}
			{ this.props.merged ? displayMerged() : ''}
			</div>
		);
	}
}

export default Merge
