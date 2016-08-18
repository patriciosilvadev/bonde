import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { reduxForm } from 'redux-form'
import reactMixin from 'react-mixin'
import { Navigation } from 'react-router'

import * as MobilizationActions from '../MobilizationActions'
import * as Paths from '../../Paths'

import { CloseButton } from '../../components'


@reactMixin.decorate(Navigation)
export class MobilizationBasicsFormPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      initializing: true,
      submitting: false,
      error: null
    }
    const { name, goal } = props.mobilization || {name: undefined, goal: null}
    props.initializeForm({name, goal})
  }

  componentWillReceiveProps(nextProps) {
    this.state.initializing && this.setState({initializing: false})
    this.state.submitting && this.setState({submitting: false})
  }

  handleSubmit(event) {
    event.preventDefault()
    const { data, touchAll, valid, dispatch, mobilization, auth } = this.props
    const mobilizationAction = (mobilization ? MobilizationActions.editMobilization : MobilizationActions.addMobilization)
    const mobilizationId = (mobilization ? mobilization.id : null)
    const defaultData = (mobilization ? {} : {color_scheme: 'meurio-scheme'})
    this.setState({ submitting: true, error: null })

    if (valid) {
      dispatch(mobilizationAction({
        id: mobilizationId,
        transitionTo: this.transitionTo.bind(this),
        mobilization: {...data, ...defaultData},
        credentials: auth.credentials
      }))
    } else {
      touchAll()
      this.setState({ submitting: false })
    }
  }

  handleCancelClick(event) {
    event.preventDefault()
    this.goBack()
  }

  renderErrorMessage() {
    if (this.state.error) {
      return (
        <div className="red center mt2">{this.state.error}</div>
      )
    }
  }

  renderCancelButton() {
    if(this.props.mobilization) {
      return (
        <button
          className="caps button bg-darken-3 h3 mt1 p2 mr2"
          disabled={this.state.submitting}
          onClick={::this.handleCancelClick}>
          Cancelar
        </button>
      )
    }
  }

  renderNameLength() {
    const { data: {name} } = this.props
    if(name && name.length > 0) {
      return(
        <div className={classnames('right h3', (name.length > 90 ? 'red' : null))}>{100 - name.length}</div>
      )
    }
  }

  renderGoalLength() {
    const { data: {goal} } = this.props
    if(goal && goal.length > 0) {
      return(
        <div className={classnames('right h3', (goal.length > 490 ? 'red' : null))}>{500 - goal.length}</div>
      )
    }
  }

  renderForm() {
    const {
      data: { name, goal },
      errors: { name: nameError, goal: goalError },
      touched: { name: nameTouched, goal: goalTouched },
      handleChange,
      handleBlur,
      mobilization
    } = this.props
    const submitText = (mobilization ? 'Salvar' : 'Continuar')

    return (
      <form onSubmit={::this.handleSubmit}>
        <label className="block h4 caps bold mb1 left">Nome</label>
        { this.renderNameLength() }
        {nameError && nameTouched && <span className="red ml2">{nameError}</span>}
        <input
          type="text"
          className="field-light block h3 full-width mt1 mb2"
          placeholder="Ex: Pela criação de uma delegacia de desaparecidos"
          style={{height: '48px'}}
          value={name}
          onChange={handleChange('name')}
          onBlur={handleBlur('name')} />

        <label className="block h4 caps bold mb1 left">Objetivo</label>
        { this.renderGoalLength() }
        {goalError && goalTouched && <span className="red ml2">{goalError}</span>}
        <textarea
          className="field-light block h3 full-width mt1 mb2"
          placeholder="Faça um texto curto, capaz de motivar outras pessoas a se unirem à sua mobilização. Você poderá alterar este texto depois."
          style={{height: '160px'}}
          value={goal}
          onChange={handleChange('goal')}
          onBlur={handleBlur('goal')} />


        <div className="clearfix">
          {this.renderCancelButton()}
          <input
            type="submit"
            className={classnames("caps button bg-aqua h3 mt1 p2", (mobilization ? null : 'full-width'))}
            disabled={this.state.submitting}
            value={this.state.submitting ? "Salvando..." : submitText} />
        </div>

        {::this.renderErrorMessage()}
      </form>
    )
  }

  render(){
    const { mobilization, dirty } = this.props
    return(
      <div className="p3">
        {(mobilization === undefined ?
          <h3 className="h2 mt0 mb3 center">Qual o objetivo da sua mobilização?</h3> :
          null)}
        <div className="bg-white border rounded lg-col-6 mx-auto p3">
          { !this.state.initializing && this.renderForm() }
          { mobilization && <CloseButton dirty={dirty} path={Paths.editMobilization(mobilization.id)} /> }
        </div>
      </div>
    )
  }
}

MobilizationBasicsFormPage.propTypes = {
  mobilization: PropTypes.object,  // NewMobilizationContainer
  dirty: PropTypes.bool.isRequired,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

const fields = ['name', 'goal']

const validate = values => {
  const errors = {}
  if (!values.name) {
    errors.name = 'Insira o nome da mobilização'
  } else if (values.name.length > 100) {
    errors.name = 'Seu título está muito longo!'
  }

  if (!values.goal) {
    errors.goal = 'Insira o objetivo da mobilização'
  } else if (values.goal.length > 500) {
    errors.goal = 'O limite de caracteres foi atingido.'
  }
  return errors
}

export default reduxForm({
  form: 'mobilizationBasics',
  fields,
  validate
},
(state, ownProps) => ({
  initialValues: ownProps.mobilization || {},
  auth: state.auth
}), { ...MobilizationActions })(MobilizationBasicsFormPage)
