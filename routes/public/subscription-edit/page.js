import React from 'react'
import classnames from 'classnames'
import uuid from 'uuid'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { Background } from '~client/components/layout'
import { CreditCardForm } from '~client/subscriptions/forms'
import { FlatForm } from '~client/ux/components'

if (require('exenv').canUseDOM) {
  require('./page.scss')
}

const CreditCardFormImplementation = CreditCardForm({
  mapDispatchToProps: {
    submit: values => (dispatch, getState, { api }) => {
      console.log('[routes/public/subscription-edit/page.connected.js] values', values)
    }
  }
})

const SubscriptionEditPage = props => {
  const {
    modificationType,
    animationStack,
    setModificationType,
    appendAnimationStack,
    removeAnimationStack
  } = props
  const displayForm = (form, type) => {
    const append = () => {
      setModificationType(type)
      appendAnimationStack(form)
    }

    if (animationStack.length) {
      removeAnimationStack(0)
      setTimeout(append, 1000)
    } else append()
  }

  const RecurringForm = props => (
    <b className='h1 p3 center block'>RecurringForm</b>
  )

  return (
    <div className='routes--subscription-edit-page'>
      <Background image={
        require('exenv').canUseDOM
          ? require('~client/images/bg-login.png')
          : ''
      }>
        <section className='section--choose-type'>
          <h1 style={{
            color: '#333',
            marginTop: 0,
            fontWeight: 'bold',
            fontSize: '2em'
          }}>
            Dados da Assinatura
          </h1>
          <p className='paragraph--helper-text'>
            Selecione abaixo qual informação da sua assinatura você quer alterar.
          </p>
          <div className='container--tab-buttons'>
            <button
              className={classnames(
                'button--creditcard button',
                { active: modificationType === 'creditcard' }
              )}
              onClick={() => displayForm(CreditCardFormImplementation, 'creditcard')}
            >
              Cartão de crédito
            </button>
            <button
              className={classnames(
                'button--recurring button',
                { active: modificationType === 'recurring' }
              )}
              onClick={() => displayForm(RecurringForm, 'recurring')}
            >
              Data da doação
            </button>
          </div>
          <CSSTransitionGroup
            transitionName={`transition--form-${modificationType}`}
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
          >
            {animationStack.map(ItemComponent => (
              <div key={uuid()} style={{ overflowY: 'hidden' }}>
                <ItemComponent {...props} FormComponent={FlatForm} />
              </div>
            ))}
          </CSSTransitionGroup>
        </section>
      </Background>
    </div>
  )
}

export default SubscriptionEditPage