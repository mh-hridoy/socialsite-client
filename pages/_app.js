import Header from '../components/base/Header'
import '../styles/globals.css'
import {
  ChakraProvider,
  extendTheme,
  Flex,
  Show,
  withDefaultColorScheme,

} from "@chakra-ui/react"
import "react-phone-input-2/lib/style.css"
import "emoji-mart/css/emoji-mart.css"

import StoreProvider from '../store'
import SideBar from '../components/base/SideBar'

const colors = {
  white: "#fff",
  dark: "#000",
  textColor: "#212121",
  buttonColor: "#ff552f",
}

const theme = extendTheme(
  {
    colors,
    components: {
      Button: {
        baseStyle: {
          fontSize: "20px",
          _focus: {
            boxShadow: "none",
          },
          _active: {
            transform: "scale(0.9)",
          },
          _hover: {
            backgroundColor: "#fff",
            border: "1px solid #ff552f",
            color: "buttonColor",
          },
        },
      },
    },
    styles: {
      global: {
        a: {
          color: "#ff552f",
          cursor: "pointer",
          _hover: {
            textDecoration: "underline",
          },
        },
      },
    },
  },

  withDefaultColorScheme({
    colorScheme: "buttonColor",
    components: ["Button", "Badge"],
  })
)


function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <ChakraProvider theme={theme}>
        {/* Header */}
        <Header />

        <Show above="md">
          <Flex>
            <SideBar />
            <Component {...pageProps} />
          </Flex>
        </Show>

        <Show below="md">
          <Component {...pageProps} />
        </Show>
        {/* No footers */}
      </ChakraProvider>
    </StoreProvider>
  )
}

export default MyApp
