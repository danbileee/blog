import { NextPage } from 'next';

import { GlobalStyle } from '../styles';

const Home: NextPage = () => (
  <div>
    <GlobalStyle />
    <div>Hello World</div>
  </div>
);

export default Home;
