export const Colors = {
  PRIMARY: '#FFB085',
  SECONDARY: '#F9D5A7',
  BG: '#FEF1E6',
  TEXT: '#90AACB',
  DIMMED: 'rgba(0,0,0,0.3)',
} as const

export type ColorsKey = keyof typeof Colors
