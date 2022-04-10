import React from 'react'
import { Flex, useColorModeValue } from "@chakra-ui/react"
import {useSelector} from 'react-redux'


const RightSideBar = () => {
      const user = useSelector((state) => state.user.user)

  return (
    <>
      {user != null ? (
        <Flex
          minWidth={["5%", "10%", "20%", "30%", "30%"]}
          position="sticky"
          top={0}
          zIndex={100}
          height={"56px"}
          bg={useColorModeValue("whiteAlpha.800", "#1A202C88")}
        ></Flex>
      ) : null}
    </>
  )
}

export default RightSideBar