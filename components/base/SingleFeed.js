import React from 'react'
import { Flex, useColorModeValue } from "@chakra-ui/react"
import FeedCard from '../custom/FeedCard'
import { useRouter } from 'next/router'

const SingleFeed = ({item, totalComment}) => {
  const router = useRouter()
  // console.log(item)
  return (
    <>
      <Flex
        onClick={(e) => e.stopPropagation()}
        zIndex={80}
        borderRight={"1px"}
        borderLeft={"1px"}
        borderColor={useColorModeValue("gray.200", "#333")}
        widht="100%"
        mt={2}
        p={2}
      >
        {item?.postType == "quote" ? (
          <FeedCard totalComment={totalComment} hasQuote={true} item={item} />
        ) : (
          <FeedCard totalComment={totalComment} item={item} />
        )}
      </Flex>
    </>
  )
}

export default SingleFeed