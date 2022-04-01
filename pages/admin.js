import React, {useState, useEffect} from 'react'
import {
  Flex,
  Text,
  Spinner,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react"
import UserModel from '../components/custom/UserModel'
import axios from 'axios'
import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'
import WithHeader from '../components/custom/WithHeader'
const Admin = () => {
    const [loading, setLoading] = useState(true)
    const [checkNow, setIsCheckNow] = useState(false)
    const router = useRouter()
  const toast = useToast({ position: "top", isClosable: true })
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const [userInfo, setUserInfo] = useState([])

    useEffect(() => {
        setIsCheckNow(true)
    }, [])

    // console.log(userInfo)

    useEffect(() => {
        if(checkNow == true) {
            if(user == null) router.push("/login")
            const checkUser = async () => {
                try{
                        const { data } = await axios(
                          `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-all-user/${user._id}`,
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            withCredentials: true,
                          }
                        )

                        setUserInfo(data)
                    setLoading(false)
                }catch(e) {
                    const errorMsg = e.response && e.response.data.message
                    router.push("/")
                    setLoading(false)
                    toast({
                      status: "error",
                      duration: 5000,
                      title: errorMsg || "Something went wrong!!!",
                    })
                }
            }
            checkUser()

        }

        return () => setIsCheckNow(false)
    }, [checkNow==true])

  return (
    <>
      {loading ? (
        <Flex
          width={"100%"}
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner color="rgb(29, 155, 240)" size="xl" />
        </Flex>
      ) : (
        <>
          <WithHeader headerName="List of Users And Controls!">
            <Flex
              borderRight={"1px"}
              borderLeft={"1px"}
              borderColor={useColorModeValue("gray.200", "#333")}
              width={"100%"}
              minH="90vh"
            >
              <Flex width={"100%"} justifyContent="center">
                <Flex direction="column" gap={5} width={["100%", "95%", "80%"]}>
                  <Flex
                    width={"100%"}
                    maxHeight="75vh"
                    overflow="auto"
                    padding={6}
                    direction="column"
                    gap={5}
                  >
                    {userInfo.length != 0 &&
                      userInfo.map((user, inx) => {
                        return <UserModel key={inx} user={user} />
                      })}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </WithHeader>
        </>
      )}
    </>
  )
}

export default Admin