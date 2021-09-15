/* eslint-disable prettier/prettier */
import { css } from '@emotion/react';

export const global = css`
  :root {
    line-height: 1.5;
    text-size-adjust: 100%;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a {
    text-decoration: none;
    margin: 0;
  }

  button {
    cursor: pointer;
    background: none;
    padding: 0;
    border: none;
    outline: none;
  }

  ol,
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    margin: 0;
  }

  label {
    font-size: 14px;
  }

  select {
    outline: none;
  }

  input:focus {
    outline: none;
  }

  textarea {
    box-shadow: none;
    resize: none;
  }

  textarea:focus {
    outline: none;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  img {
    border-style: none;
  }

  code,
  kbd,
  samp,
  pre {
    font-family: 'Lucida Console', 'Monaco', monospace;
  }
`;
