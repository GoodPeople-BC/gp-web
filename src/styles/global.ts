import { css } from '@emotion/react'

// 전역 스타일 입력
const globalStyle = css`
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Titillium+Web:wght@200;400;600&display=swap');

  body {
    background-color: white;
    font-family: 'Titillium Web', sans-serif !important;
  }
  * {
    margin: 0;
    padding: 0;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  #logo {
    font-family: 'Pacifico', cursive;
  }
`

export default globalStyle
