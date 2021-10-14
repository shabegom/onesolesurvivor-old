import React, { Component } from "react"
import { Form, Select, Input } from "formsy-react-components"
import { Redirect } from "react-router"
import { withFirebase } from "./Firebase"
import AddCastaway from "./AddCastaway"

const Selected = (props) => {
  const processSelection = (selection) => {
    let selections = []
    if (props.name === "tribal") {
      selections.push(selection)
    } else {
      selections = selection.map((select) => {
        return (
          <div
            key={select}
            onClick={() => {
              props.handleRemove(props.name, select)
            }}
          >
            {select} ❌
          </div>
        )
      })
    }
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
      {props.selection && processSelection(props.selection)}
    </div>
  )
}

const Selection = (props) => {
  return (
    <>
      <Select
        name={props.name}
        label={props.label}
        options={props.options}
        required={props.required || false}
        onChange={props.handleChange}
      />
      <Selected
        selection={props.selected}
        handleRemove={props.handleRemove}
        name={props.name}
      />
    </>
  )
}

const HandleIdol = (hasIdol) => {
  const idolActions = [
    { value: "", label: "What did they do?" },
    { value: "voted-out", label: "Voted out with idol" },
    { value: "saved-self", label: "Saved themself!" },
    { value: "burned", label: "Burned the idol" }
  ]
  let idols = hasIdol.map((castaway, i) => {
    return (
      <div key={i}>
        {castaway}
        <Select name={"idolAction-" + castaway} options={idolActions} />
      </div>
    )
  })
  return <div>{idols}</div>
}

const Tribe = (props) => {
  return (
    <div>
      <Input
        name={props.number.toString()}
        value={props.tribeName}
        type='text'
        placeholder='Tribe Name'
        onChange={props.handleNewTribe}
      />
      <Select
        name={props.number.toString()}
        options={props.castaways.shift()}
        help='hold command to choose multiple'
        onChange={props.handleNewTribeCastaway}
        multiple
      />
    </div>
  )
}

const DisplayBuffs = (props) => {
  const children = []
  for (var i = 0; i < props.numTribes; i += 1) {
    children.push(
      <Tribe
        number={i}
        id={i}
        tribeName={props.tribes[i] ? props.tribes[i].tribe : ""}
        handleNewTribe={props.handleNewTribe}
        handleNewTribeCastaway={props.handleNewTribeCastaway}
        selected={props.selected}
        castaways={props.castaways}
      />
    )
  }
  return (
    <div className='buffs'>
      <input
        type='button'
        className='btn btn-standard'
        name='new-tribe'
        onClick={props.addTribe}
        defaultValue='New Tribe'
      />
      <input
        type='button'
        className='btn btn-alert'
        name='remove-tribe'
        onClick={props.removeTribe}
        defaultValue='Remove Tribe'
      />
      {children}
    </div>
  )
}

class MainForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buffs: false,
      numTribes: 2,
      loggedIn: false,
      started: "closed",
      hasIdol: [],
      tribal: undefined,
      tribals: [],
      eliminated: [],
      extinction: [],
      immunity: [],
      reward: [],
      wonIdol: [],
      foundIdol: [],
      merged: false,
      tribes: [],
      finalTribal: false,
      castaways: []
    }
  }

  componentDidMount() {
    let { state, tribals, castaways } = this.props.root
    const { started = "closed", numTribes = 2, merged = "false" } = state
    if (tribals) {
      tribals = tribals.filter((tribal) => tribal.value !== "final-tribal")
      const tribalOptions = [
        { value: "reset", label: "Choose which tribal" },
        ...tribals
      ]
      const castawaysOptions = [
        { value: "clear", label: "Choose a castaway" },
        ...castaways
      ]
      let usedIdol = tribals.reduce((acc, tribal) => {
        if (tribal.idolUsers) {
          acc.push(tribal.idolUsers)
        }
        return acc.flat()
      }, [])
      const hasIdol = tribals
        .reduce((acc, tribal) => {
          if (tribal.foundIdol) {
            acc.push(tribal.foundIdol)
          }
          if (tribal.wonIdol) {
            acc.push(tribal.wonIdol)
          }
          return acc.flat()
        }, [])
        .filter((idolHolder) => {
          if (usedIdol.includes(idolHolder)) {
            const index = usedIdol.indexOf(idolHolder)
            usedIdol = usedIdol.splice(index, 1)
            return false
          } else {
            return true
          }
        })
      if (hasIdol) {
        this.setState({ hasIdol })
      }
      this.setState({
        tribals: tribalOptions,
        castaways: castawaysOptions
      })
    }
    this.setState({
      started,
      numTribes,
      merged
    })
    this.props.firebase.auth.auth.onAuthStateChanged((authUser) => {
      const adminId = process.env.REACT_APP_ADMIN_UID
      authUser && authUser.uid === adminId
        ? this.setState({ loggedIn: true })
        : this.setState({ loggedIn: false })
    })
  }

  selectionChange = (stateKey) => (element, event) => {
    if (event !== "clear") {
      if (this.state[stateKey] && this.state[stateKey][0]) {
        this.setState((state) => ({ [stateKey]: [...state[stateKey], event] }))
      } else {
        this.setState({ [stateKey]: [event] })
      }
    }
  }

  mergeChange = (event) => {
    if (event.target.value === "false") {
      this.setState({
        merged: true
      })
    } else if (event.target.value === "true") {
      this.setState({
        merged: false
      })
    }
  }

  buffsChange = (event) => {
    if (event.target.value === "false") {
      this.setState({
        buffs: true
      })
    } else if (event.target.value === "true") {
      this.setState({
        buffs: false
      })
    }
  }
  handleAddTribe = (event) => {
    this.setState({ numTribes: this.state.numTribes + 1 })
  }

  handleRemoveTribe = (event) => {
    this.setState({ numTribes: this.state.numTribes - 1 })
  }

  handleRemove = (name, selection) => {
    const current = this.state[name]
    const index = current.indexOf(selection)
    const newState = {}
    newState[selection] = current.splice(index, 1)
    this.setState(newState)
  }

  handleCreateTribal = (event) => {
      const tribals = this.state.tribals
      const count = tribals.length + 1
      tribals.push({
        value: `tribal-${count}`,
        label: `Tribal ${count}`,
        complete: false
      })
      this.props.firebase.db.set.setTribals(tribals)
      this.setState({ tribals, tribal: `tribal-${count}` })
  }

  handleSelectTribal = (label, value) => {
    if (value === "reset") {
      const state = {
        tribal: "",
        eliminated: [],
        extinction: [],
        foundIdol: [],
        wonIdol: [],
        reward: [],
        immunity: [],
        merged: this.state.merged
      }
      this.setState(state)
    } else {
      const val = parseInt(value.split("-")[1]) - 1
      const {tribals} = this.props.root
        const object = tribals[val] || {}
        const { eliminated, extinction, foundIdol, wonIdol, reward, immunity } =
          object
        this.setState({
          tribal: [value],
          eliminated,
          extinction,
          foundIdol,
          wonIdol,
          reward,
          immunity
        })
    }
  }
  processForm = (data) => {
    data.eliminated = this.state.eliminated
    data.extinction = this.state.extinction
    data.idolFound = this.state.foundIdol
    data.idolWon = this.state.wonIdol
    data.reward = this.state.reward
    data.merged = this.state.merged
    data.immunity = this.state.immunity
    data.reward = this.state.reward

      const {castaways} = this.props.root
      const updatedCastaways = []
      castaways.forEach((castaway) => {
        this.state.tribes.forEach((tribe) => {
          if (tribe.castaways.includes(castaway.value)) {
            castaway.tribe = tribe.tribe
          }
        })
        updatedCastaways.push(castaway)
      })
      this.props.firebase.db.set.setCastaways(updatedCastaways)
    this.props.processForm(data)
  }

  handleOpenPicks = () => {
    this.props.firebase.db.get.getState().update({ started: "open" })
    this.setState({ started: "open" })
  }

  handleOpenSeason = () => {
    this.props.firebase.db.get.getState().update({ started: "started" })
    this.setState({ started: "started" })
  }

  handleNewTribe = (name, value) => {
    this.setState((state) => {
      let tribes = []
      if (state.tribes[name]) {
        const castaways = state.tribes[name].castaways
          ? state.tribes[name].castaways
          : []
        tribes[name] = { tribe: value, castaways }
      } else {
        tribes.push({ tribe: value, castaways: [] })
      }
      return { tribes }
    })
  }

  handleNewTribeCastaway = (name, value) => {
    this.setState((state) => {
      let tribes = []
      if (state.tribes[name]) {
        tribes[name] = { tribe: state.tribes[name].tribe, castaways: value }
      } else {
        tribes.push({ tribe: "", castaways: value })
      }
      return { tribes }
    })
  }

  handleFinalTribal = () => {
    if (this.state.finalTribal === true) {
      this.setState({
        tribal: "",
        finalTribal: false
      })
    } else if (this.state.finalTribal === false) {
      this.setState({
        tribal: "final-tribal",
        finalTribal: true
      })
    }
  }

  render() {
    const displayForm = () => {
      return (
        <div className='flex-center'>
          <button
            className='btn btn-primary create-tribal'
            onClick={this.handleCreateTribal}
          >
            Create New Tribal
          </button>
          {this.state.tribals[0] && this.state.tribal !== "final-tribal" && (
            <Form onSubmit={(data) => this.processForm(data)}>
              <Selection
                name='tribal'
                label='Select a Tribal to Edit'
                selected={this.state.tribal}
                options={this.state.tribals}
                handleChange={this.handleSelectTribal}
                handleRemove={this.handleRemove}
              />
              <Selection
                name='eliminated'
                label='Who was eliminated?'
                selected={this.state.eliminated}
                options={this.state.castaways}
                required={true}
                handleChange={this.selectionChange("eliminated")}
                handleRemove={this.handleRemove}
              />
              <Selection
                name='foundIdol'
                label='Anyone find an idol?'
                selected={this.state.foundIdol}
                options={this.state.castaways}
                handleChange={this.selectionChange("foundIdol")}
                handleRemove={this.handleRemove}
              />
              <Selection
                name='wonIdol'
                label='Anyone win an idol?'
                selected={this.state.wonIdol}
                options={this.state.castaways}
                handleChange={this.selectionChange("wonIdol")}
                handleRemove={this.handleRemove}
              />
              {this.state.hasIdol || this.state.foundIdol ? (
                <h3>Did anyone use their idol?</h3>
              ) : (
                ""
              )}
              {this.state.hasIdol ? HandleIdol(this.state.hasIdol) : ""}
              {this.state.foundIdol ? HandleIdol(this.state.foundIdol) : ""}
              {this.state.wonIdol ? HandleIdol(this.state.wonIdol) : ""}
              <div>
                <input
                  type='checkbox'
                  name='merge'
                  checked={this.state.merged}
                  value={this.state.merged}
                  onChange={this.mergeChange}
                />{" "}
                Made it to the merge? <br />
                {this.state.merged ? (
                  <div className='merged'>
                    <Selection
                      name='immunity'
                      label='Who won immunity?'
                      options={this.state.castaways}
                      handleChange={this.selectionChange("immunity")}
                      selected={this.state.immunity}
                      handleRemove={this.handleRemove}
                    />
                    <Selection
                      name='reward'
                      label='Who won reward?'
                      options={this.state.castaways}
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
                  type='checkbox'
                  name='buffs'
                  value={this.state.buffs}
                  onChange={this.buffsChange}
                />{" "}
                Drop your buffs? <br />
                {this.state.buffs ? (
                  <DisplayBuffs
                    tribes={this.state.tribes}
                    castaways={this.state.castaways}
                    numTribes={this.state.numTribes}
                    addTribe={this.handleAddTribe}
                    removeTribe={this.handleRemoveTribe}
                    handleNewTribe={this.handleNewTribe}
                    handleNewTribeCastaway={this.handleNewTribeCastaway}
                  />
                ) : (
                  ""
                )}
              </div>
              <input
                style={{ textAlign: "center" }}
                className='btn btn-primary'
                formNoValidate={true}
                type='submit'
                defaultValue='Submit'
              />
              <br />
              <input
                type='checkbox'
                name='final-tribal'
                checked={this.state.finalTribal}
                value={this.state.finalTribal}
                onChange={this.handleFinalTribal}
              />{" "}
              Final Tribal? <br />
            </Form>
          )}

          {this.state.tribal === "final-tribal" && (
            <Form
              onSubmit={(data) => {
                    const {tribals} = this.props.root || []
                    const finalExists = tribals.filter(
                      (tribal) => tribal.value === "final-tribal"
                    )[0]
                    if (!finalExists) {
                      tribals.push({
                        value: `final-tribal`,
                        label: `Final Tribal`,
                        complete: "false"
                      })
                      this.props.firebase.db.set.setTribals(tribals)
                    }
                data.tribal = "final-tribal"
                this.processForm(data)
              }}
            >
              <input
                type='checkbox'
                name='final-tribal'
                checked={this.state.finalTribal}
                value={this.state.finalTribal}
                onChange={this.handleFinalTribal}
              />{" "}
              Final Tribal? <br />
              <Selection
                name='immunity'
                label='Who won?'
                options={this.state.castaways}
                handleChange={this.selectionChange("immunity")}
                selected={this.state.immunity}
                handleRemove={this.handleRemove}
              />
              <Selection
                name='eliminated'
                label='Who lost?'
                selected={this.state.eliminated}
                options={this.state.castaways}
                required={true}
                handleChange={this.selectionChange("eliminated")}
                handleRemove={this.handleRemove}
              />
              <input
                style={{ textAlign: "center" }}
                className='btn btn-primary'
                formNoValidate={true}
                type='submit'
                defaultValue='Submit'
              />
            </Form>
          )}
          {this.props.fireRedirect && <Redirect to={"/"} />}
        </div>
      )
    }

    if (this.state.loggedIn) {
      if (this.state.started === "closed") {
        return (
          <div className='flex-center'>
            Add Castaways
            <AddCastaway castaways={this.state.castaways} />
            <br />
            <button className='btn btn-primary' onClick={this.handleOpenPicks}>
              Open the Picks!
            </button>
          </div>
        )
      } else if (this.state.started === "open") {
        return (
          <div className='flex-center'>
            <button className='btn btn-primary' onClick={this.handleOpenSeason}>
              Start the Season!
            </button>
          </div>
        )
      } else {
        return displayForm()
      }
    } else {
      return ""
    }
  }
}

export default withFirebase(MainForm)
