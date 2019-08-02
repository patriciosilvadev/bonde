```js
<Page>
  <Text>Welcome to bonde.org</Text>
</Page>
```


### Page - `menuComponent`


```js
import { Tab, TabItem } from '../';

const PageTabMenu = () => (
  <Tab inverted>
    <TabItem active>Informações</TabItem>
    <TabItem>Mobilizadores</TabItem>
    <TabItem>Conta</TabItem>
    <TabItem>Domínios</TabItem>
    <TabItem>Integrações</TabItem>
  </Tab>
);

<Page menuComponent={PageTabMenu}>
  <Text>Welcome to bonde.org</Text>
</Page>
```


### Page - with header


```js
import { Tab, TabItem, Header, Page } from '../';

const ModuleTabMenu = () => (
  <Tab>
    <TabItem>Editar</TabItem>
    <TabItem active>Configurações</TabItem>
  </Tab>
);
const PageTabMenu = () => (
  <Tab inverted>
    <TabItem active>Informações</TabItem>
    <TabItem>Mobilizadores</TabItem>
    <TabItem>Conta</TabItem>
    <TabItem>Domínios</TabItem>
    <TabItem>Integrações</TabItem>
  </Tab>
);

<div>
  <Header PageTitle='Respeita as Mina'>
    <ModuleTabMenu />
  </Header>
  <Page menuComponent={PageTabMenu}>
    <Text>Welcome to bonde.org</Text>
  </Page>
</div>
```