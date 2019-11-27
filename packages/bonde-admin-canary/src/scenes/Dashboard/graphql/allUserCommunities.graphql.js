import gql from 'graphql-tag'

export default gql`
  query CurrentUserCommunities ($offset: Int) {
    communities(limit: 20, offset: $offset) {
      id
      name
      city
      description
      image
      created_at
      updated_at
      mailchimp_api_key
      mailchimp_list_id
      mailchimp_group_id
      fb_link
      twitter_link
      facebook_app_id
      email_template_from
      modules
    }

    communities_aggregate {
      aggregate {
        count
      }
    }
  }
`
