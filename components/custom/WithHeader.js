import React from 'react'
import {
 
  Flex,
  useColorModeValue,
  Text,
  
} from "@chakra-ui/react"
const WithHeader = (props) => {
  return (
    <>
      <Flex
        width={"100%"}
        alignItems="start"
        justifyContent="center"
        px={4}
        position="sticky"
        direction={"column"}
        top={0}
        zIndex={100}
        backdropFilter="blur(5px)"
        height={"56px"}
        bg={useColorModeValue("whiteAlpha.800", "#1A202C88")}
        borderRight={"1px"}
        borderLeft={"1px"}
        borderColor={useColorModeValue("gray.200", "#333")}
      >
        <Text fontWeight={800} fontSize={18}>
          {props.headerName}
        </Text>
        <Text fontWeight={200} fontSize={12}>
          {" "}
          {props.totalPost && props.totalPost + " Feeds"} 
        </Text>
      </Flex>
      {props.children}
    </>
  )
}

export default WithHeader