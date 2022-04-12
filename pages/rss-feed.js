import React, {useState, useEffect} from 'react'
import {Flex, Text, Spinner} from '@chakra-ui/react'
import {useSelector} from "react-redux"

const RssFeed = () => {
    const [isLoading, setIsLoading] = useState(true)
    const rssFeed = useSelector((state) => state.feed.rssFeed)

    useEffect(() => {
        setIsLoading(!isLoading)
    }, [])

  return (
    <Flex
      minHeight={"100vh"}
      maxWidth={"90%"}
      overflow="auto"
    >
      {isLoading ? (
        <Flex
          alignItems={"center"}
          justifyContent="center"
          height={"80vh"}
          width={"100%"}
        >
          <Spinner color={"rgb(29, 155, 240)"} size={"xl"} />
        </Flex>
      ) : (
        <>
          {!rssFeed ? (
            <Text textAlign={"center"} marginTop={20}>
              Please Check feeds first.
            </Text>
          ) : (
            <Text maxWidth={"85%"} wordBreak={"break-all"}>
              {JSON.stringify(rssFeed, undefined, 2)}{" "}
            </Text>
          )}
        </>
      )}
    </Flex>
  )
}

export default RssFeed