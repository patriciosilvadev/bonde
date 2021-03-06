import React, { useState, useEffect } from 'react';
import { Button, Icon, InputField, Label, Link, Text, Modal } from 'bonde-components';
import styled from 'styled-components';
import { css } from 'styled-components/macro';
import { FieldArray } from 'react-final-form-arrays';
import { useTranslation } from 'react-i18next';
import SubjectBodyFields from './SubjectBodyFields';
import DeleteTargetPopup from './DeleteTargetPopup';

const ButtonStyled = styled(Button).attrs({ type: 'button' })`
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 18px;
  justify-content: flex-start;
`;

const IconButton = styled.button.attrs({ type: 'button' })`
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  background: none;
`;

type GroupFieldProps = {
  name: string
  group?: any
  remove: any
}

const GroupField = ({ name, group, remove }: GroupFieldProps) => {
  const [open, setOpen] = useState(!group);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { t } = useTranslation('widgetActions');

  useEffect(() => {
    if (group) setOpen(false);
    // eslint-disable-next-line
  }, [])

  const onClose = () => setOpenDeleteModal(false);

  return !open ? (
    <div
      css={css`
        display: flex;
        align-items: center;
        border: 1px solid #eee;
        border-radius: 2px;
        margin-bottom: 10px;
        padding: 20px 18px;

        ${IconButton} {
          margin-left: 10px;
        }
      `}
    >
      <Text color='#000' style={{ flexGrow: 1 }}>{group.label || 'Nome do grupo'}</Text>
      <IconButton onClick={() => setOpen(true)}>
        <Icon name='Pencil' size='small' />
      </IconButton>
      <IconButton onClick={() => setOpenDeleteModal(true)}>
        <Icon name='Trash' size='small' />
      </IconButton>
      <Modal width='385px' isOpen={openDeleteModal} onClose={onClose}>
        <DeleteTargetPopup
          pressureTargetId={group.id}
          remove={remove}
          onClose={onClose}
        />
      </Modal>
    </div>
  ) : (
      <div
        css={css`
          margin: 15px 0;
          border: 1px solid #eee;
          padding: 20px 18px;
        `}
      >
        <InputField
          name={`${name}.label`}
          label={t('settings.pressure.label.group_label')}
          placeholder={t('settings.pressure.placeholder.group_label')}
        />
        <SubjectBodyFields
          prefix={name}
          emailSubjectName='email_subject'
          emailBodyName='email_body'
        />
        <div css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;

          button {
            width: 140px;
          }
        `}>
          <Link
            onClick={() => {
              // remove when
              if (!group) remove();
              // close card
              setOpen(false)
            }}
          >
            {t('settings.pressure.button.cancel')}
          </Link>
          <Button type='button' onClick={() => setOpen(false)}>
            {t('settings.pressure.button.add')}
          </Button>
        </div>
      </div>
    );
}

export type GroupFormProps = {
  form: {
    mutators: {
      push: any
      pop: any
    }
  }
}

const GroupForm = ({ form: { mutators } }: GroupFormProps) => {
  const { t } = useTranslation('widgetActions');

  // Render
  return (
    <>
      <InputField
        name='settings.select_label'
        label={t('settings.pressure.label.select_label')}
        placeholder={t('settings.pressure.placeholder.select_label')}
      />
      <div
        css={css`
          margin-bottom: 15px;

          ${Label} {
            display: block;
            margin-bottom: 8px;
          }
        `}
      >
        <Label>Adicionar grupo de alvos</Label>
        <FieldArray name="groups">
          {({ fields }) =>
            fields.map((name, index) => (
              <GroupField
                key={name}
                name={name}
                group={fields.value[index]}
                remove={() => fields.remove(index)}
              />
            ))
          }
        </FieldArray>
        <ButtonStyled
          secondary
          onClick={() => mutators.push('groups', undefined)}
        >
          {t('settings.pressure.button.addGroup')}
        </ButtonStyled>
      </div>
    </>
  );
}

export default GroupForm;