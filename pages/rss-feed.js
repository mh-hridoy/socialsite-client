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
    <>
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
            <Text>{JSON.stringify(rssFeed, undefined, 2)} </Text>
          )}
        </>
      )}
    </>
  )
}

export default RssFeed