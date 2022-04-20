import React from "react"
import { Flex, Text, Spinner, useColorModeValue } from "@chakra-ui/react"
import CreateNewFeed from "../custom/CreateNewFeed"
import AllPost from "../custom/AllPost"
import { useRouter } from "next/router"
import {useSelector} from "react-redux"
import { useTranslation } from "react-i18next"

const HomeComponent = ({
  setPage,
  page,
  totalPage,
  fetchingHomeData,
  quoteData,
  setQuoteData,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) => {
  const router = useRouter()
  const homeData = useSelector((state) => state.homeData.homeData)
  const { t, i18n } = useTranslation()

  return (
    <Flex
      justifyContent="center"
      marginBottom={5}
      w={"100%"}
      minHeight="100vh"
      pt={5}
      borderRight={"1px"}
      borderLeft={"1px"}
      borderColor={useColorModeValue("gray.200", "#333")}
    >
      <Flex w={"100%"} direction={"column"} gap={4}>
        <CreateNewFeed
          
          name="file"
        />
        <Text fontWeight={600} mb={2}>
          {t("Recent Post")}
        </Text>
        <AllPost
          // setFetchData={setFetchData}
          quoteData={quoteData}
          setQuoteData={setQuoteData}
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
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
            <Spinner color={"rgb(29, 155, 240)"} size={"sm"} />
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
