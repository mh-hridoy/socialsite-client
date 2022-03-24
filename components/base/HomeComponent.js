import React from "react"
import { Flex, Text, Spinner } from "@chakra-ui/react"
import CreateNewFeed from "../custom/CreateNewFeed"
import AllPost from "../custom/AllPost"
import {useRouter} from "next/router"
const HomeComponent = ({
  homeData,
  setPage,
  page,
  totalPage,
  fetchingHomeData,
}) => {
  const router = useRouter()
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
        <AllPost
          // setFetchData={setFetchData}
          setPage={setPage}
          totalPage={totalPage}
          page={page}
          post={homeData}
        />
        {fetchingHomeData && page != 1 && (
          <Flex
            mt={2}
            alignItems="center"
            justifyContent={"center"}
            width={"100%"}
          >
            <Spinner color={"#ff552f"} size={"sm"} />
          </Flex>
        )}
        {!fetchingHomeData && totalPage == page && (
          <Text mt={5} textAlign={"center"} fontSize={14} opacity={0.7}>
            There's nothing to show!{" "}
            <a onClick={() => router.push("/")}>Please go back to top</a>
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export default HomeComponent
