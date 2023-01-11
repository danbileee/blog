import { css } from '@emotion/react';

export const global = css`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css');
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap');

  :root {
    --purple: #b200e9;
    --cornflowerblue: #4263eb;
    --skyblue: #47f6cb;
    --green: #94d82d;
    --yellow: #fff30d;
    --orange: #fd7e14;
    --red: #f03e3e;
    --gray900: #121111;
    --gray-800: #272822;
    --gray600: #757575;
    --gray300: #c4c4c4;
    --gray200: #e1e1e1;
    --gray100: #f5f5f5;
    --white: #ffffff;
  }

  html {
    scroll-behavior: smooth;
    text-size-adjust: 100%;
  }

  body {
    margin: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui,
      Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo',
      'Noto Sans KR', 'Malgun Gothic', sans-serif;
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
    color: var(--gray900);
  }

  button {
    cursor: pointer;
    background: none;
    padding: 0;
    border: none;
    outline: none;
    color: var(--gray900);
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
