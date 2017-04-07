import React, { Component, PropTypes } from 'react'

class StepsContainerStack extends Component {
  constructor (props) {
    super(props)
    this.state = { step: 1 }
  }

  hasPointer () {
    return this.props.ComponentPointerContainer &&
      this.props.ComponentPointerChildren &&
      this.props.pointerChildrenProps
  }

  refreshStepsProgress (props = this.props) {
    const { progressValidations: validations } = props
    //
    // Check if the childrens validation pass.
    // If it pass, jump to the next step.
    // If not, define it as current.
    //
    let step = this.state.step
    validations && validations.length && validations.map((validate, index) => {
      const position = index + 1
      const isCurrent = step === position
      const isLast = validations.length === position
      if (isCurrent && !isLast && validate()) step++
    })
    this.setState({ ...this.state, step })
  }

  componentWillReceiveProps (nextProps) {
    this.refreshStepsProgress(nextProps)
  }

  componentWillMount () {
    this.refreshStepsProgress()
  }

  render () {
    const {
      ComponentPointerContainer,
      ComponentPointerChildren,
      pointerChildrenProps,
      progressValidations,
      propsPropagationWhitelist,
      children
    } = this.props

    return (
      <div className='steps-stack'>
        {!(this.hasPointer()) ? null : (
          <ComponentPointerContainer>
            {!(children && children.length) ? null : children.map((child, index) => (
              <ComponentPointerChildren
                {...pointerChildrenProps({
                  ...this.state,
                  ...this.props,
                  index: index + 1
                })}
              />
            ))}
          </ComponentPointerContainer>
        )}

        {/* Render StepContent with position */}
        {children && children.length ? children.map((child, index) => {
          const { step } = this.state
          const position = index + 1
          const isCurrentStep = position === step
          const incrementStep = () => this.setState({ step: step + 1 })

          if (position <= step) {
            const validate = progressValidations[index]
            const styleFromParent = { display: isCurrentStep ? 'block' : 'none' }
            const onNextStep = () => isCurrentStep && validate() && incrementStep()
            const propagateProps = {
              position,
              step,
              styleFromParent,
              onNextStep,
              propsPropagationWhitelist
            }

            return React.cloneElement(child, propagateProps)
          }
        }) : children ? React.cloneElement(children, { position: 1 }) : null}
      </div>
    )
  }
}

StepsContainerStack.propTypes = {
  ComponentPointerContainer: PropTypes.node,
  ComponentPointerChildren: PropTypes.node,
  pointerChildrenProps: PropTypes.func,
  progressValidations: PropTypes.array.isRequired,
  propsPropagationWhitelist: PropTypes.array
}

StepsContainerStack.defaultProps = {
  propsPropagationWhitelist: []
}

export default StepsContainerStack
