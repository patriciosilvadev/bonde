import React from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import Auth from 'j-toker'
import $ from 'jquery'

Auth.configure({
  apiUrl: process.env.BASE_URL,
  handleTokenValidationResponse: function(resp) {
    // https://github.com/lynndylanhurley/j-toker/issues/10
    PubSub.publish("auth.validation.success", resp.data)
    return resp.data
  }
})

$.ajaxSetup({beforeSend: Auth.appendAuthHeaders})
$(document).ajaxComplete(Auth.updateAuthCredentials)

@connect(state => ({ auth: state.auth }))
export default class Application extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      auth: {
        user: Auth.user
      }
    }
  }

  componentWillMount() {
    PubSub.subscribe('auth', function() {
      this.setState({ auth: { user: Auth.user } })
    }.bind(this))
  }

  render() {
    return(
      <div>
        {this.props.children &&
          React.cloneElement(this.props.children, {user: this.state.auth.user})}
      </div>
    )
  }
}
