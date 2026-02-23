import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`

* {
  font-family: Work Sans, sans-serif;
  --primary-main: #1559ed;
  --grey-50: #f0f0f0;
  --grey-500: #999999;
  --grey-600: #666666;
  --grey-700: #d9d9d9;
  --grey-800: #aeaeae;
  --main-red: #be1520;
  --secondary-red: #d64747;
  --light-gray: #f3f3f3;
  --light-grey: #e5e5e5;
  --main-bg: #fafafa;
  --main-bg2: #f2f2f2;
  --main-gray: #808080;
  --main-error: #d32f2f;
  --main-success: #2e7d32;
  --dark-gray: #404040;
  --disabled-gray: #bfbfbf;
  --text-gray: #222222;
  --text-primary: rgba(0, 0, 0, 0.87);
  --text-secondary: rgba(0, 0, 0, 0.7);
  --text-tertiary: rgba(0, 0, 0, 0.42);
  --light-text-primary: #212121;
  --light-text-secondary: #666666;
  --divider: rgba(0, 0, 0, 0.12);
  --divider-opaque: rgba(191, 191, 191, 0.25);
  --divider-opaque-main-gray: rgba(128, 128, 128, 0.25);
  --common-white: #fff;
  --success: #298a40;
  --info: #239cb0;
  --error: #e52734;
  --error-bg: #fbdfe1;
  --info-bg: #def0f3;
  --success-bg: #dfeee3;
  --action-active: rgba(0, 0, 0, 0.56);
  --action-disabled: rgba(0, 0, 0, 0.38);
  --action-disabled-background: rgba(0, 0, 0, 0.12);
  --support-main: #239bb2;
  --black: #000000;

  overscroll-behavior: none;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;

  ::-webkit-scrollbar {
    width: 8px;
    height: 6px;
    background: var(--light-gray);
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: #c8cbcd;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--disabled-gray);
  }
  --padding-global: 80px;
}

html {
  height: 100%;
}

body {
  font-size: 0.875rem;
  background-color: var(--main-bg);
  min-height: 100vh;
}

html,
body {
  margin: 0;
  padding: 0;
  color: var(--text-primary);
  letter-spacing: 0.48px;
  width: 100%;
}

button {
  cursor: pointer;

  &:disabled {
    cursor: not-allowed !important;
  }
}

button,
input,
textarea {
  background: none;
  border: none;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  outline: none;
  word-wrap: break-word;
  padding: 0;
  margin: 0;
}

#root {
  height: 100%;
}

a:link {
  text-decoration: none;
  color: var(--text-gray);
}

p,
h1 {
  margin: 0;
}

ul {
  display: block;
  list-style-type: none;
  margin-block-start: 0px;
  margin-block-end: 0px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
}

.defaultPaddingSide {
  padding-left: var(--padding-global);
  padding-right: var(--padding-global);
}


`

export default GlobalStyles
