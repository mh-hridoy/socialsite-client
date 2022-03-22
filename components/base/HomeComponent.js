import React from 'react'
import { Flex } from "@chakra-ui/react"
import CreateNewFeed from "../custom/CreateNewFeed"
import AllPost from "../custom/AllPost"


const HomeComponent = ({ homeData }) => {
  return (
    <Flex
      alignItems={"center"}
      justifyContent="center"
      marginBottom={5}
      w={"100%"}
      pt={5}
    >
      <Flex w={["90%", "90%", "75%"]} direction={"column"} gap={4}>
        <CreateNewFeed />
        <AllPost post={homeData} />
      </Flex>
    </Flex>
  )
}

export default HomeComponent