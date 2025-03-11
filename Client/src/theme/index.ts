import { extendTheme, theme as defaultTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body: `Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  },
  components: {
    Heading: {
      variants: {
        'page-title': {
          fontSize: 'lg',
          fontWeight: 600,
          lineHeight: 'tall',
          color: 'gray.800',
        },
        'section-title': {
          fontSize: 'md',
          fontWeight: 600,
          lineHeight: 'base',
          color: 'gray.800',
          textAlign: 'left',
        },
        'header-title': {
          fontSize: 'xl',
          fontWeight: 600,
          lineHeight: 'tall',
          color: 'gray.800',
        },
      },
    },
    Text: {
      variants: {
        'task-item': {
          fontSize: 'sm',
          fontWeight: 400,
          lineHeight: 'tall',
          color: 'gray.800',
        },
        'stat-label': {
          fontSize: 'sm',
          fontWeight: 500,
          lineHeight: 'base',
          color: 'gray.600',
        },
        'stat-number': {
          fontSize: 'lg',
          fontWeight: 600,
          lineHeight: 'short',
          color: 'gray.800',
        },
      },
    },
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Link: {
      baseStyle: {
        color: 'brand.500',
        _hover: {
          textDecoration: 'none',
          color: 'brand.600',
        },
      },
    },
  },
  styles: {
    global: (props) => ({
      '*': {
        WebkitFontSmoothing: 'antialiased',
        fontSmoothing: 'antialiased',
      },
      'html, body': {
        width: '100%',
        height: '100%',
        fontFamily: 'Roboto',
        overflow: 'hidden',
        color: props.colorMode === 'light' ? 'gray.700' : 'whiteAlpha.900',
      },
      a: {
        _hover: {
          textDecoration: 'none !important',
        },
      },
    }),
  },
  colors: {
    brand: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#319795',
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044',
    },
    gray: {
      800: 'rgb(45, 55, 72)',
    },
  },
})

export default theme

export const transitions = {
  base: (prop?: string) => `${prop || 'all'} .15s ease-out`,
}
