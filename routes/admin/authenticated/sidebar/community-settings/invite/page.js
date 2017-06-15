import PropTypes from 'prop-types'
import React from 'react'

import {
  FormRedux,
  FormGroup,
  FormControl,
  ControlLabel,
  UploadImageField,
  HelpBlock
} from '~client/components/forms'
import { SettingsForm } from '~client/ux/components'
import Button from '~client/ux/components/button'

var styles = require('exenv').canUseDOM ? require('./page.scss') : {}

const CommunitySettingsInfoPage = ({
  fields: { email },
  resetForm,
  location,
  community,
  downloadActivists,
  ...formProps
}) => (
  <FormRedux
    {...formProps}
    nosubmit
    onFinishSubmit={() => resetForm()}
  >
    <FormGroup controlId='email' {...email}>
      <ControlLabel>Pessoas</ControlLabel>
      <FormControl
        type='text'
        placeholder='Insira um email para convidar'
        containerClassName={styles.inlineFormControlContainer}
        content={(
          <span className={styles.buttonWrapper}>
            <Button type='submit'>Convidar</Button>
          </span>
        )}
      />
    </FormGroup>
  </FormRedux>
)

CommunitySettingsInfoPage.propTypes = {
  fields: PropTypes.shape({
    image: PropTypes.object.isRequired,
    name: PropTypes.object.isRequired,
    city: PropTypes.object.isRequired,
    description: PropTypes.object.isRequired,
    email_template_from: PropTypes.object
  }),
  community: PropTypes.object.isRequired
}

export default CommunitySettingsInfoPage
