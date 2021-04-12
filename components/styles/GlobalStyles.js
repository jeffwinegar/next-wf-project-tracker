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

  html {
    box-sizing: border-box;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    
    color: var(--black);
    background-color: var(--lightGray);
  }

  body {
    font-size: 100%;
    line-height: calc(1ex / 0.32);
  }

  h1, h2 {
    line-height: calc(1ex / 0.42);
    margin: calc(1ex / 0.42) 0;
  }
  h1 {
    font-size: 2.5em;
  }
  h2 {
    font-size: 2em;
  }
  h3 {
    font-size: 1.75em;
    line-height: calc(1ex / 0.38);
    margin: calc(1ex / 0.38) 0;
  }
  h4 {
    font-size: 1.5em;
    line-height: calc(1ex / 0.37);
    margin: calc(1ex / 0.37) 0;
  }
  h5 {
    font-size: 1.25em;
    line-height: calc(1ex / 0.36);
    margin: calc(1ex / 0.36) 0;
  }
  h6 {
    font-size: 1em;
  }

  h6, p:not([class]) {
    line-height: calc(1ex / 0.32);
    margin: calc(1ex / 0.64) 0;
  }
`;
