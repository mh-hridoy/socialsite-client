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
import "react-responsive-carousel/lib/styles/carousel.min.css" 
import ProgressBar from "@badrap/bar-of-progress"
import Router from "next/router"

import StoreProvider from '../store'
import SideBar from '../components/base/SideBar'
import { useState } from 'react'
import RightSideBar from '../components/custom/RightSideBar'

const progress = new ProgressBar({
  size: 2,
  color: "rgb(29, 180, 240",
  className: "bar-of-progress",
  delay: 100,
})

const colors = {
  white: "#fff",
  dark: "#000",
  textColor: "#212121",
  buttonColor: "rgb(29, 180, 240)",
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
            backgroundColor: "rgb(29, 155, 240)",
            color: "white",
          },
        },
      },
    },
    styles: {
      global: {
        a: {
          color: "rgb(29, 155, 240)",
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
  const [headerName, setHeaderName] = useState("Home")


  Router.events.on("routeChangeStart", progress.start)
  Router.events.on("routeChangeComplete", progress.finish)
  Router.events.on("routeChangeError", progress.finish)


  
  return (
    <StoreProvider>
      <ChakraProvider theme={theme}>
        {/* <Header /> */}

        <Flex>
          <SideBar />
          <Flex direction="column" width={"100%"}>
            
            <Component
              headerName={headerName}
              setHeaderName={setHeaderName}
              {...pageProps}
            />
          </Flex>
          <Show above="md">
           <RightSideBar/>
          </Show>
        </Flex>

        {/* No footers */}
      </ChakraProvider>
    </StoreProvider>
  )
}

export default MyApp
