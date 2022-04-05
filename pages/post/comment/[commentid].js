import React, { useState, useEffect } from "react"
import { Flex, Spinner, useColorModeValue } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import WithHeader from "../../../components/custom/WithHeader"
import SingleComments from "../../../components/custom/SingleComments"
import useHttp from "../../../components/utils/useHttp"
import { useRouter } from "next/router"

const CommentShow = () => {
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.user)
  const [fetchData, setFetchData] = useState(false)
  const [item, setItem] = useState({})
  const router = useRouter()

  useEffect(() => {
    setFetchData(true)
  }, [])



  const { _ } = useHttp({
    fetchNow: fetchData,
    setFetchNow: setFetchData,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/getone-comment/${router.query.commentid}`,
    isAuth: true,
    isSetData: true,
    setData: setItem,
    isEToast: true,
    cb: () => setLoading(false),
    ecb: () => setLoading(false),
  }) 


  return (
    <>
      <Flex w={"100%"} alignItems={"center"} justifyContent="center">
        <Flex
          direction="column"
          minWidth={
            user != null ? "100%" : ["100%", "100%", "60%", "50%", "50%"]
          }
        >
          {loading ? (
            <Flex
              height="100vh"
              alignItems={"center"}
              justifyContent="center"
              width={"100%"}
            >
              <Spinner color={"rgb(29, 155, 240)"} size={"xl"} />
            </Flex>
          ) : (
            <WithHeader headerName="Feed/Comment">
              <Flex
                borderRight={"1px"}
                borderLeft={"1px"}
                borderColor={useColorModeValue("gray.200", "#333")}
                minHeight={"90vh"}
                widht="100%"
                overflowX="hidden"
                mt={2}
                p={2}
              >
                <SingleComments item={item} />
              </Flex>
            </WithHeader>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default CommentShow
