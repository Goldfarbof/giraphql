const colors = require('tailwindcss/colors')

// eslint-disable-next-line import/no-commonjs
module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      coolGray: colors.coolGray,
      blue: {
        950: '#031516',
        900: '#062B2C',
        850: '#0A4043',
        800: '#0D5659',
        750: '#106B6F',
        700: '#138085',
        650: '#16969B',
        600: '#1AABB2',
        550: '#1DC1C8',
        500: '#20D6DE',
        450: '#36DAE1',
        400: '#4DDEE5',
        350: '#63E2E8',
        300: '#79E6EB',
        250: '#90EBEF',
        200: '#A6EFF2',
        150: '#BCF3F5',
        100: '#D2F7F8',
        50: '#E9FBFC',
      },
      yellow: {
        950: '#191006',
        900: '#33210C',
        850: '#4C3111',
        800: '#664217',
        750: '#80531D',
        700: '#996323',
        650: '#B37329',
        600: '#CC842E',
        550: '#E69534',
        500: '#FFA53A',
        450: '#FFAE4E',
        400: '#FFB761',
        350: '#FFC075',
        300: '#FFC989',
        250: '#FFD29D',
        200: '#FFDBB0',
        150: '#FFE4C4',
        100: '#FFEDD8',
        50: '#FFF6EB',
      },
      purple: {
        950: '#06040C',
        900: '#0B0917',
        850: '#110D23',
        800: '#17122E',
        750: '#1D173A',
        700: '#221B46',
        650: '#281F51',
        600: '#2E245D',
        550: '#332968',
        500: '#392D74',
        450: '#4D4282',
        400: '#615790',
        350: '#746C9E',
        300: '#8881AC',
        250: '#9C96BA',
        200: '#B0ABC7',
        150: '#C4C0D5',
        100: '#D7D5E3',
        50: '#EBEAF1',
      },
      pink: {
        950: '#170511',
        900: '#2E0B22',
        850: '#451033',
        800: '#5C1544',
        750: '#731B56',
        700: '#892067',
        650: '#A02578',
        600: '#B72A89',
        550: '#CE309A',
        500: '#E535AB',
        450: '#E849B3',
        400: '#EA5DBC',
        350: '#ED72C4',
        300: '#EF86CD',
        250: '#F29AD5',
        200: '#F5AEDD',
        150: '#F7C2E6',
        100: '#FAD7EE',
        50: '#FCEBF7',
      },
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
