import React from 'react';
import {
  ConnectedForm,
  Button
} from 'bonde-components';
import { useSession, useMutation, gql } from 'bonde-core-tools';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';

const UpdateCommunityGQL = gql`
  mutation UpdateCommunity ($update_fields: communities_set_input!, $id: Int!) {
    update_communities(_set: $update_fields, where: { id: { _eq: $id } }) {
      returning {
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
        recipient {
          id
          transfer_day: recipient(path: "transfer_day")
          transfer_interval: recipient(path: "transfer_interval")
          transfer_enabled: recipient(path: "transfer_enabled")
          bank_account: recipient(path: "bank_account")
        }
      }
    }
  }
`;

const UpdateRecipientGQL = gql`
  mutation UpdateRecipient($update_fields: recipients_set_input, $id: Int!) {
    update_recipients(_set: $update_fields, where: { id: { _eq: $id } }) {
      returning {
        id
        transfer_day: recipient(path: "transfer_day")
        transfer_interval: recipient(path: "transfer_interval")
        transfer_enabled: recipient(path: "transfer_enabled")
        bank_account: recipient(path: "bank_account")
      }
    }
  }
`;

export default ({ children }: any) => {
  const { community, onChange } = useSession();
  const { t } = useTranslation('community');
  const [updateRecipient] = useMutation(UpdateRecipientGQL);
  const [updateCommunity] = useMutation(UpdateCommunityGQL);

  const submit = async ({ community: { __typename, id, recipient: { id: recipient_id, ...recipient }, ...update_fields } }: any) => {
    // Update Recipient before to return UpdateCommunity outdate
    await updateRecipient({ variables: { update_fields: { recipient }, id: recipient_id }});
    const { data: { update_communities: { returning }}}: any = await updateCommunity({ variables: { id, update_fields } });
    // Update Session
    await onChange({ community: returning[0] });
    // Popup successfully
    toast(t('messages.success'), { type: toast.TYPE.SUCCESS });
  }

  return (
    <ConnectedForm initialValues={{ community }} onSubmit={submit}>
      {({ submitting }) => (
        <>
          {children}
          <Button type='submit' disabled={submitting}>{t('buttons.submit')}</Button>
        </>
      )}
    </ConnectedForm>
  );
}

// TODO:
// - Success Message (Toastify)