import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import * as Paths from '../Paths'
import { Label, SaveButton, CloseButton } from './../components'

import { editMobilization } from '../Mobilization/MobilizationActions'
import * as Selectors from '../Mobilization/MobilizationSelectors'

class MobilizationCustomDomain extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = { edited: false }
    props.initializeForm({customDomain: props.mobilization.custom_domain})
  }

  componentWillReceiveProps(nextProps) {
    const { editing } = this.props
    if (editing !== nextProps.editing) {
      this.setState({
        edited: editing && !nextProps.editing
      })
    }
  }

  handleSubmit(event) {
    const { editMobilization, data, auth, mobilization, initializeForm, valid, touchAll } = this.props
    event.preventDefault()

    if (valid) {
      editMobilization({
        credentials: auth.credentials,
        id: mobilization.id,
        mobilization: {
          custom_domain: data.customDomain
        }
      })
      initializeForm(data)
    } else {
      touchAll()
    }
  }

  render() {
    const {
      handleChange,
      handleBlur,
      data,
      editing,
      mobilization,
      dirty,
      errors,
      touched
    } = this.props

    return (
      <div className="py3 px3 col col-8">
        <p className="h5">
          Você pode personalizar o endereço da sua mobilização caso já tenha um domínio.
          Preencha o campo abaixo e clique em Salvar.
          <form onSubmit={::this.handleSubmit}>
            <div className='mb1'>
              <Label>Domínio personalizado</Label>
            </div>
            <input
              type='text'
              className='field-light mr1'
              style={{width: '250px'}}
              placeholder='www.meudominio.com.br'
              onChange={handleChange('customDomain')}
              onBlur={handleBlur('customDomain')}
              value={data.customDomain}
            />
            <SaveButton
              saving={editing}
              saved={this.state.edited && !dirty}
              handleClick={::this.handleSubmit}
            />
            {errors.customDomain
              && touched.customDomain
              && <span className="red block">{errors.customDomain}</span>}
          </form>
        </p>
        <p>
          <strong>Atenção</strong>: você ainda precisa configurar o seu domínio no servidor de registro para que ele seja redirecionado para a página da sua mobilização. Para isso, utilize as informações abaixo.
        </p>
        <table>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Dados</th>
          </tr>
          <tr>
            <td><code>{data.customDomain}</code></td>
            <td><code>CNAME</code></td>
            <td><code>{mobilization.slug}.reboo.org</code></td>
          </tr>
        </table>
        <CloseButton dirty={dirty} path={Paths.editMobilization(mobilization.id)} />
      </div>
    )
  }
}

MobilizationCustomDomain.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,

  auth: PropTypes.object.isRequired,
  mobilization: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired
}

const fields = ['']

const validate = values => {
  const errors = {}
  const regex = /^(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
  if (values.customDomain && !regex.test(values.customDomain)) {
    errors.customDomain = 'Informe um domínio válido'
  }
  return errors
}

export default reduxForm({
  form: 'mobilizationCustomDomain',
  fields,
  validate
},
(state, ownProps) => {
  const mobilization = Selectors.getMobilization(state, ownProps)
  return {
    editing: state.mobilization.saving,
    mobilization: mobilization,
    initialValues: { customDomain: mobilization.custom_domain }
  }
}, { editMobilization })(MobilizationCustomDomain)
