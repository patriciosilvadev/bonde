import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { I18n } from 'react-i18next'
import { Text } from 'bonde-styleguide'
import { UserCommunities, CommunityMenu } from 'scenes/Dashboard/components'
import { ImageColumn, TableCardGadget } from 'scenes/Dashboard/scenes/Home/components'


const RenderText = ({ row }) => (
  <Fragment>
    <Text fontSize={16} fontWeight={900} lineHeight={1.25}>
      {row.name}
    </Text>
    <Text fontSize={13} lineHeight={1.54} color='#4a4a4a'>
      {row.description || row.city}
    </Text>
  </Fragment>
)

RenderText.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    city: PropTypes.string
  })
}

const columns = [
  {
    field: 'image',
    render: ImageColumn,
    props: { width: '40px' }
  },
  {
    field: 'text',
    render: RenderText
  },
  {
    field: 'id',
    render: ({ row }) => (<CommunityMenu community={row} />),
    props: { width: '150px' }
  }
]

const CommunitiesGadget = () => (
  <UserCommunities
    component={({ loading, communities }) => (
      <I18n ns='home'>
      {t => (
        <TableCardGadget
          loading={loading}
          data={communities}
          columns={columns}
          title={t('gadgets.communities.title')}
          emptyIcon='community'
          emptyText={t('gadgets.communities.emptyText')}
        />
      )}
      </I18n>
    )}
  />
)

export default CommunitiesGadget
