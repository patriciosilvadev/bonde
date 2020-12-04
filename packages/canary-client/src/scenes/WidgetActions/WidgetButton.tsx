import React from 'react';
import { Header, Text, Icon } from 'bonde-components';
import styled from 'styled-components';
import { Widget } from './FetchWidgets';

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: 205px;
  height: 175px;
  background-color: #fff;
  padding: 25px 20px;
  box-shadow: 0 10px 20px -7px rgba(0,0,0,0.05);
  border-radius: 4px;

  margin: 10px;
  flex: 1 1 205px;
`;

type FlexProps = {
  spacing?: boolean
  margin?: string
  grow?: string
  align?: 'center' | 'flex-end'
}

const Flex = styled.div<FlexProps>`
  display: flex;
  align-items: ${props => props.align};
  ${props => props.spacing && `justify-content: space-between;`}
  ${props => props.margin && `margin: ${props.margin};`}
  ${props => props.grow && `flex-grow: ${props.grow};`}

  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  ${Text} {
    margin: 0;
    font-size: 13px;
  }

  ${Text}.break {
    text-overflow: ellipsis;
    height: 36px;
    white-space: break-spaces;
    overflow: hidden;
    line-height: 1.50;
    word-break: break-all;
  }
`

Flex.defaultProps = {
  align: 'center'
}

type Props = {
  widget: Widget
}

const WidgetButton = ({ widget }: Props) => {
  const {
    kind,
    block: {
      mobilization: {
        image,
        name
      }
    },
    actions: {
      aggregate: {
        count
      }
    }
  } = widget;

  const labels: { title: string, count: string } = ({
    pressure: { title: 'Pressão', count: 'pressões' },
    form: { title: 'Formulário', count: 'envios' },
    donation: { title: 'Doação', count: 'doações' },
    'pressure-phone': { title: 'Telefone', count: 'pressões' }
  })[kind]

  return (
    <Panel>
      <Flex spacing margin='0 0 12px'>
        <Text bold uppercase>{labels.title}</Text>
        <Icon name='Settings' size='small' />
      </Flex>
      <Flex grow='1' margin='0 0 12px'>
        <img src={image || 'https://via.placeholder.com/40'} alt={name} />
        <Text className='break'>{name}</Text>
      </Flex>
      <Flex align='flex-end'>
        <Header.H2>{count}</Header.H2>
        <Text>{labels.count}</Text>
      </Flex>
    </Panel>
  )
}

export default WidgetButton;