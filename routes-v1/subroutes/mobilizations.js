import React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
// Redux
import { selectMobilization } from '~client/mobrender/redux/action-creators'
import MobSelectors from '~client/mobrender/redux/selectors'
// Pages
import MobilizationList from '~routes/admin/authenticated/sidebar/mobilizations-list/page.connected'
import MobilizationsNew from '~routes/admin/authenticated/sidebar/mobilizations-new/page.connected'
import MobilizationsEdit from '~routes/admin/authenticated/sidebar/mobilizations-edit/page.connected'
import MobilizationsLaunch from '~routes/admin/authenticated/sidebar/mobilizations-launch/page.connected'
import MobilizationsLaunchEnd from '~routes/admin/authenticated/sidebar/mobilizations-launch-end/page.connected'
import MobilizationsSettings from '~root/routes-v1/subroutes/mobilizations-settings'
import BlockCreate from '~routes/admin/authenticated/sidebar/blocks-create/page.connected'

const stateToProps = (state) => ({
  mobilization: MobSelectors(state).getMobilization()
})

const actionsToProps = {
  select: selectMobilization
}

const InsideMobilization = connect(stateToProps, actionsToProps)(class extends React.Component {
  componentDidMount () {
    const {
      mobilization,
      select,
      match: { params: { mobilization_id: id } }
    } = this.props
    if (!mobilization && id) {
      return Promise.all([select(id)])
    }
  }

  render () {
    const { match: { path } } = this.props
    return (
      <React.Fragment>
        <Route exact path={`${path}/blocks/create`} component={BlockCreate} />
        <Route exact path={`${path}/edit`} component={MobilizationsEdit} />
        <Route exact path={`${path}/launch`} component={MobilizationsLaunch} />
        <Route exact path={`${path}/launch/end`} component={MobilizationsLaunchEnd} />

        <Route path={`${path}/settings`} component={MobilizationsSettings} />
      </React.Fragment>
    )
  }
})

export default ({ match: { path } }) => (
  <React.Fragment>
    <Route exact path={`${path}`} component={MobilizationList} />
    <Route exact path={`${path}/new`} component={MobilizationsNew} />
    <Route path={`${path}/:mobilization_id`} component={InsideMobilization} />
  </React.Fragment>
)
