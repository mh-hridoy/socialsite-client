import React, { useState, useEffect } from "react"
import { Flex, Spinner, useColorModeValue } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import WithHeader from "../../../components/custom/WithHeader"
import axios from "axios"
import SingleComments from "../../../components/custom/SingleComments"

const CommentShow = () => {
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const [fetchData, setFetchData] = useState(false)
  const [item, setItem] = useState({})
  const router = useRouter()

  useEffect(() => {
    setFetchData(true)
  }, [])

 

  useEffect(() => {
    const commentId = window.location.pathname.split("/")[3]
    if (fetchData == true) {
      const fetchPostData = async () => {
        try {
          const { data } = await axios(
            `${process.env.NEXT_PUBLIC_MAIN_PROXY}/getone-comment/${commentId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          )
          setItem(data)
          setLoading(!loading)
          setFetchData(!fetchData)
        } catch (e) {
          setLoading(!loading)
          setFetchData(!fetchData)
          const errorMsg = e.response && e.response.data.message
          console.log(errorMsg)
        }
      }
      fetchPostData()
    }
  }, [fetchData == true])

  console.log(item)

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
            <WithHeader headerName="Feed">
              <Flex
                borderRight={"1px"}
                borderLeft={"1px"}
                borderColor={useColorModeValue("gray.200", "#333")}
                minHeight={"90vh"}
                widht="100%"
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
