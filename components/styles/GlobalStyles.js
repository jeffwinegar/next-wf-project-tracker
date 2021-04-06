import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --black: #424344;
    --darkGray: #5a5e61;
    --mediumGray: #a8abaf;
    --gray: #d9dce1;
    --lightGray: #f2f3f5;
    --offWhite: #f7f7f9;
    --white: #ffffff;
    --wtBlue: #0a47ed;
    --wfOrange: #f7931e;

    --shadow: 0px 3px 8px -3px var(--gray);
    --maxWidth: 1000px;
  }
`;
