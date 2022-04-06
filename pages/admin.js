import React, {useState, useEffect} from 'react'
import {
  Flex,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react"
import UserModel from '../components/custom/UserModel'
import {useSelector} from 'react-redux'
import WithHeader from '../components/custom/WithHeader'
import useHttp from "../components/utils/useHttp"


const Admin = () => {
    const [loading, setLoading] = useState(true)
    const [checkNow, setIsCheckNow] = useState(false)
  const user = useSelector((state) => state.user.user)
  const [userInfo, setUserInfo] = useState([])

    useEffect(() => {
        setIsCheckNow(true)
    }, [])

    const { requestedData } = useHttp({
      fetchNow: checkNow,
      setFetchNow: setIsCheckNow,
      url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-all-user/${user?._id}`,
      isAuth: true,
      isSetData: true,
      setData: setUserInfo,
     isEToast: true,
      isEPush: true,
      epushTo: "/login",
      cb: (() => {setIsCheckNow(false); setLoading(false); console.log(requestedData) })
    })


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