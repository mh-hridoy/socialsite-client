import React from 'react'
import { Flex, useColorModeValue } from "@chakra-ui/react"
import FeedCard from '../custom/FeedCard'

const SingleFeed = ({item}) => {
  return (
    <>
      <Flex
        borderRight={"1px"}
        borderLeft={"1px"}
        borderColor={useColorModeValue("gray.200", "#333")}
        minHeight={"90vh"}
        widht="100%"
        mt={2}
        p={2}
      >
        <FeedCard item={item} />
      </Flex>
    </>
  )
}

export default SingleFeed