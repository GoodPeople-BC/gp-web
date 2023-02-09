import { css } from '@emotion/react'

import { Colors } from './colors'
import font from './font'

/* prettier-ignore */
const reset = css`
  html,body {
      background:${Colors.BG};
    width: 100%;
    height: 100%;
    color:${Colors.TEXT};
    font-family: SUIT, sans-serif;
    -webkit-font-smoothing: antialiased;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    touch-action: manipulation;
  }
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font-family: SUIT, sans-serif;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
`

const globalStyle = css`
  ${reset};
  ${font}

  html {
    -webkit-text-size-adjust: none;
    background-color: #fff;

    letter-spacing: -0.02em;
  }

  html,
  body {
    width: 100%;
    min-width: 1200px;
    height: 100%;
  }

  #root {
    max-width: 1920px;
    margin: auto;
  }

  :focus:not(:focus-visible) {
    outline: 0;
  }

  body,
  input,
  select,
  button,
  textarea,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  table {
    font: inherit;
    letter-spacing: inherit;
    color: inherit;
  }

  textarea {
    resize: none;
  }

  input[type='text'],
  input[type='password'],
  input[type='submit'],
  input[type='tel'],
  input[type='number'],
  input[type='email'],
  input[type='url'],
  input[type='search'],
  textarea {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  strong,
  b {
    font-weight: 600;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  button {
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  img,
  a {
    -webkit-user-drag: none;
  }

  a {
    color: inherit;
    text-decoration: underline;
  }
`

export default globalStyle
