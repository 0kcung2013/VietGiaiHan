import { createTheme, type MantineColorsTuple } from '@mantine/core'

const woodBrown: MantineColorsTuple = [
  '#FAF6F0',
  '#F0E3D2',
  '#DFC6A7',
  '#CDA579',
  '#B6814F',
  '#96633A',
  '#784C2C',
  '#5D3820',
  '#482919',
  '#3A2010',
]

export const theme = createTheme({
  fontFamily: "'DM Sans', Arial, sans-serif",
  headings: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  primaryColor: 'woodBrown',
  colors: {
    woodBrown,
  },
  defaultRadius: 'sm',
})
