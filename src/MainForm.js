import React, { Component } from "react";
import { Form, Select, Input } from "formsy-react-components";
import {
  eliminatedCastawayDropDown,
  castawaysMultiSelect,
  castawaysDropDown,
  tribals,
  idolActions
} from "./data.js";

import { Redirect } from "react-router";
import { withFirebase } from "./Firebase";
// import { CastawaysContext } from "./Castaways";

const Selected = (props) => {
  const processSelection = (selection) => {
    const selections = []
    selection.forEach(selection => {
      if (props.name === "tribal") {
        selections.push(selection)
      } else {
selections.push(
          <div onClick={() => { props.handleRemove(props.name, selection) }}>
            {selection} ❌
          </div>
        )
      }
        
    })
    return selections
  }
  return (
    <div
      style={{
        paddingLeft: "10%",
        width: "30%",
        marginLeft: "30%",
        marginBottom: "10px"
      }}
    >
      {props.selection && processSelection(props.selection)
      }
    </div>
  )
 
}

const Selection = props => {
  return (
    <>
      <Select
        name={props.name}
        label={props.label}
        options={props.options}
        required={props.required || false}
        onChange={props.handleChange}
      />
      <Selected selection={props.selected} handleRemove={props.handleRemove} name={props.name} />
    </>
  );
};

const HandleIdol = hasIdol => {
  let idols = hasIdol.map((castaway, i) => {
    return (
      <div key={i}>
        {castaway}
        <Select name={"idolAction-" + castaway} options={idolActions} />
      </div>
    );
  });
  return <div>{idols}</div>;
};

const Tribe = props => {
  return (
    <div>
      <Input
        name={"tribe-name-" + props.number}
        value=""
        type="text"
        placeholder="Tribe Name"
      />
      <Select
        name={"tribe-members-" + props.number}
        options={castawaysMultiSelect}
        help="hold command to choose multiple"
        multiple
      />
    </div>
  );
};

const DisplayBuffs = props => {
  const children = [];
  for (var i = 0; i < props.numTribes; i += 1) {
    children.push(
      <Tribe
        number={i}
        id={i}
        onChange={props.handleChange}
        selected={props.selected}
      />
    );
  }
  return (
    <div className="buffs">
      <input
        type="button"
        className="btn btn-standard"
        name="new-tribe"
        onClick={props.addTribe}
        defaultValue="New Tribe"
      />
      <input
        type="button"
        className="btn btn-alert"
        name="remove-tribe"
        onClick={props.removeTribe}
        defaultValue="Remove Tribe"
      />
      {children}
    </div>
  );
};

class MainForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buffs: false,
      numTribes: 2,
      loggedIn: false
    };
  }

  componentDidMount() {
    this.props.firebase.auth.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ loggedIn: true })
        : this.setState({ loggedIn: false });
    });
  }

  selectionChange = stateKey => (element, event) => {
    if (this.state[stateKey]) {
      this.setState({ [stateKey]: [...this.state[stateKey], event] });
    } else {
      this.setState({ [stateKey]: [event] });
    }
  };

  mergeChange = event => {
    if (event.target.value === "false") {
      this.setState({
        merged: true
      });
    } else if (event.target.value === "true") {
      this.setState({
        merged: false
      });
    }
  };

  buffsChange = event => {
    if (event.target.value === "false") {
      this.setState({
        buffs: true
      });
    } else if (event.target.value === "true") {
      this.setState({
        buffs: false
      });
    }
  };
  handleAddTribe = event => {
    this.setState({ numTribes: this.state.numTribes + 1 });
  };

  handleRemoveTribe = event => {
    this.setState({ numTribes: this.state.numTribes - 1 });
  };

  handleRemove = (name, selection) => {
    const current = this.state[name]
    const index = current.indexOf(selection)
    const newState = {}
    newState[selection] = current.splice(index, 1)
    this.setState(newState) 
  }

  handleCreateTribal = event => {
    const tribals = this.props.firebase.db.get.getTribals().once("value", snap => {
      const val = snap.val();
      const count = val.length
    const tribal = {}
    tribal[count] = {
      value: `tribal-${count}`,
      label: `Tribal ${count}`,
      complete: "false"
    }
      this.props.firebase.db.get.getTribals().update(tribal)
      this.setState({tribal: [`tribal-${count}`]})
    })
    
    
  }

  handleSelectTribal = (label, value) => {
    if (value === "reset") {
      const state = {
        tribal: [],
        eliminated: "",
        extinction: "",
        foundIdol: [],
        wonIdol: [],
        reward: "",
        immunity: ""
      }
      this.setState(state)
    } else {
          const val = value.split('-')[1]
    this.props.firebase.db.get.getTribal(val).once("value", snap => {
      const array = snap.val()
      const { eliminated, extinction, foundIdol, wonIdol, reward, immunity } = array
      this.setState({tribal: [value],eliminated, extinction, foundIdol, wonIdol, reward, immunity})
    })
    }

    
  }
  processForm = data => {
    data.eliminated = this.state.eliminated;
    data.extinction = this.state.extinction;
    data.idolFound = this.state.foundIdol;
    data.idolWon = this.state.wonIdol;
    data.reward = this.state.reward;
    data.merged = this.state.merged ? this.state.merged : this.props.merged;
    data.immunity = this.state.immunity;
    data.reward = this.state.reward;
    this.props.processForm(data);
    this.props.firebase.auth.doSignOut();
  };
  render() {
    const displayForm = () => {
      return (
        <div>
          <Form onSubmit={data => this.processForm(data)}>
            <button className="create-tribal" onClick={this.handleCreateTribal}>Create New Tribal</button>
            <Selection
              name="tribal"
              label="Select a Tribal to Edit"
              selected={this.state.tribal}
              options={tribals}
              handleChange={this.handleSelectTribal}
              handleRemove={this.handleRemove}
            />
            <Selection
              name="eliminated"
              label="Who was eliminated?"
              selected={this.state.eliminated}
              options={castawaysDropDown}
              required={true}
              handleChange={this.selectionChange("eliminated")}
              handleRemove={this.handleRemove}
            />
            <Selection
              name="extinction"
              label="Did anyone return from extinction?"
              selected={this.state.extinction}
              options={eliminatedCastawayDropDown}
              required={false}
              handleChange={this.selectionChange("extinction")}
              handleRemove={this.handleRemove}
            />
            <Selection
              name="idolFound"
              label="Anyone find an idol?"
              selected={this.state.foundIdol}
              options={castawaysDropDown}
              handleChange={this.selectionChange("foundIdol")}
              handleRemove={this.handleRemove}
            />
            <Selection
              name="idolWon"
              label="Anyone win an idol?"
              selected={this.state.wonIdol}
              options={castawaysDropDown}
                  handleChange={this.selectionChange("wonIdol")}
              handleRemove={this.handleRemove}
            />
            {this.props.hasIdol || this.state.foundIdol ? (
              <h3>Did anyone use their idol?</h3>
            ) : (
              ""
            )}
            {this.props.hasIdol ? HandleIdol(this.props.hasIdol) : ""}
            {this.state.foundIdol ? HandleIdol(this.state.foundIdol) : ""}
            {this.state.wonIdol ? HandleIdol(this.state.wonIdol) : ""}
            <div>
              <input
                type="checkbox"
                name="merge"
                checked={this.state.merged || this.props.merged}
                value={this.state.merged || this.props.merged}
                onChange={this.mergeChange}
              />{" "}
              Made it to the merge? <br />
              {this.state.merged || this.props.merged ? (
                <div className="merged">
                  <Selection
                    name="immunity"
                    label="Who won immunity?"
                    options={castawaysDropDown}
                    handleChange={this.selectionChange("immunity")}
                    selected={this.state.immunity}
              handleRemove={this.handleRemove}
                  />
                  <Selection
                    name="reward"
                    label="Who won reward?"
                    options={castawaysDropDown}
                    handleChange={this.selectionChange("reward")}
                    selected={this.state.reward}
              handleRemove={this.handleRemove}
                  />
                </div>
              ) : (
                ""
              )}
            </div>

            <div>
              <input
                type="checkbox"
                name="buffs"
                value={this.state.buffs}
                onChange={this.buffsChange}
              />{" "}
              Drop your buffs? <br />
              {this.state.buffs ? (
                <DisplayBuffs
                  numTribes={this.state.numTribes}
                  handleChange={this.selectionChange}
                  addTribe={this.handleAddTribe}
                  removeTribe={this.handleRemoveTribe}
                />
              ) : (
                ""
              )}
            </div>
            <input
              style={{ textAlign: "center" }}
              className="btn btn-primary"
              formNoValidate={true}
              type="submit"
              defaultValue="Submit"
            />
          </Form>
          {this.props.fireRedirect && <Redirect to={"/"} />}
        </div>
      );
    };
    return <div>{this.state.loggedIn ? displayForm() : ""}</div>;
  }
}

export default withFirebase(MainForm);
