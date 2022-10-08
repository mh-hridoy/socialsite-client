import React, {useState, useEffect} from 'react'
import {
  Flex,
  Spinner,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels, Box,
  Tab,
  TabPanel,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  FormControl,
FormLabel,
Stack,
VStack,
Alert,
AlertIcon,
Input,
AlertTitle
} from "@chakra-ui/react"
import UserModel from '../components/custom/UserModel'
import {useSelector} from 'react-redux'
import WithHeader from '../components/custom/WithHeader'
import useHttp from "../components/utils/useHttp"
import {AiOutlineDelete} from 'react-icons/ai'
import {useRouter} from "next/router"
import { Formik, Field } from "formik"

import * as Yup from "yup"

const signupSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be 8 character long.")
    .max(20, "Too Long Password!")
    .required("Password cannot be empty!"),
  fullName: Yup.string()
    .min(4, "Full name is too small.")
    .max(40, "Full name is too large!")
    .required("Name cannot be empty!"),
  email: Yup.string()
    .email("Invalid email address!")
    .required("Email address is required!"),
})

const Admin = () => {
    const [loading, setLoading] = useState(true)
    const [checkNow, setIsCheckNow] = useState(false)
  const user = useSelector((state) => state.user.user)
  const [userInfo, setUserInfo] = useState([])
  const [getReports, setGetReports] = useState(false)
  const [reportData, setReportData] = useState([])
  const [reportDeleting, setReportDeleting] = useState(false)
  const [reportId, setReportId] = useState(null)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [newUserValue, setNewUserValue] = useState({})
  const [sendCreateRequest, setSendCreateRequets] = useState(false)
  const router = useRouter()

    useEffect(() => {
        setIsCheckNow(true)
        setGetReports(true)
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
      cb: (() => {setIsCheckNow(false); setLoading(false) })
    })

      const { isLoading: _reportsLoading } = useHttp({
        fetchNow: getReports,
        setFetchNow: setGetReports,
        url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-report/${user?._id}`,
        isAuth: true,
        isSetData: true,
        setData: setReportData,
        isEToast: true,
        isEPush: true,
        epushTo: "/login",
      })

       const { isLoading: isReportDeleting } = useHttp({
         fetchNow: reportDeleting,
         setFetchNow: setReportDeleting,
         url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/delete-report/${user?._id}/${reportId}`,
         isAuth: true,
         isEToast: true,
         isEPush: true,
         epushTo: "/login",
         cb: (() => {
           const allReportData = [...reportData]
           const newOne = allReportData.filter((item) => item._id != reportId )
           setReportData([...new Set(newOne)])
            setReportId(null)
            setReportDeleting(false)


         })
       })

      const reportDelete = (id) => {
        setReportId(id)
        setReportDeleting(true)

      }

       const { isLoading: isCreatingOne } = useHttp({
         fetchNow: sendCreateRequest,
         setFetchNow: setSendCreateRequets,
         method: "post",
         body: newUserValue,
         url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/admin-create-account/${user?._id}`,
         isAuth: true,
         isEToast: true,
         isEPush: true,
         epushTo: "/login",
         cb: () => {
           setOpenCreateModal(false)
           router.reload()
         },
       })
      

      const signupHandler = (values) => {
        setNewUserValue(values)
        setSendCreateRequets(true)
      }


  return (
    <>
      <Modal
        size={"xl"}
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false)
        }}
      >
        <ModalOverlay />
        <ModalContent p={5} py={10}>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <Text fontWeight={600} textAlign={"center"}>
            Create new account
          </Text>
          <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} p={8}>
            <Stack spacing={4}>
              <Formik
                validationSchema={signupSchema}
                initialValues={{
                  email: "",
                  password: "",
                  fullName: "",
                }}
                onSubmit={signupHandler}
              >
                {({ handleSubmit, errors, touched }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                      <FormControl>
                        <FormLabel htmlFor="email">Full Name</FormLabel>
                        <Field
                          as={Input}
                          id="fullName"
                          name="fullName"
                          type="text"
                          variant="filled"
                        />
                        {errors.fullName && touched.fullName && (
                          <Alert
                            px={2}
                            py={1}
                            fontSize={12}
                            rounded
                            marginTop={2}
                            status="error"
                          >
                            <AlertIcon />
                            <AlertTitle>{errors.fullName}</AlertTitle>
                          </Alert>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel htmlFor="email">Email Address</FormLabel>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          variant="filled"
                        />
                        {errors.email && touched.email && (
                          <Alert
                            px={2}
                            py={1}
                            fontSize={12}
                            rounded
                            marginTop={2}
                            status="error"
                          >
                            <AlertIcon />
                            <AlertTitle>{errors.email}</AlertTitle>
                          </Alert>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type="password"
                          variant="filled"
                        />
                        {errors.password && touched.password && (
                          <Alert
                            px={2}
                            py={1}
                            fontSize={12}
                            rounded
                            marginTop={2}
                            status="error"
                          >
                            <AlertIcon />
                            <AlertTitle>{errors.password}</AlertTitle>
                          </Alert>
                        )}
                      </FormControl>

                      <Button
                        isLoading={isCreatingOne}
                        type="submit"
                        bg="buttonColor"
                        isFullWidth
                      >
                        Create Account
                      </Button>
                    </VStack>
                  </form>
                )}
              </Formik>
            </Stack>
          </Box>
        </ModalContent>
      </Modal>
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
            <Tabs>
              <TabList
                
                mb="1em"
              >
                <Tab _focus={{ boxShadow: "none" }}>Users</Tab>
                <Tab _focus={{ boxShadow: "none" }}>Reports</Tab>
              </TabList>
              <TabPanels>
                <TabPanel
                  borderRight={"1px"}
                  borderLeft={"1px"}
                  borderColor={useColorModeValue("gray.200", "#333")}
                  widht="100%"
                >
                  <Button
                    size={"sm"}
                    fontSize={15}
                    bg="buttonColor"
                    onClick={() => setOpenCreateModal(true)}
                  >
                    Create New
                  </Button>
                  <Flex width={"100%"}>
                    <Flex width={"100%"} justifyContent="center">
                      <Flex direction="column" gap={5} width={["100%"]}>
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
                </TabPanel>
                <TabPanel
                  display={"flex"}
                  flexDir="column"
                  gap={4}
                  borderRight={"1px"}
                  borderLeft={"1px"}
                  borderColor={useColorModeValue("gray.200", "#333")}
                  minHeight={"100vh"}
                >
                  {reportData.length != 0 &&
                    reportData.map((report, inx) => {
                      return (
                        <Flex
                          key={inx}
                          position={"relative"}
                          boxShadow="sm"
                          rounded="md"
                          border={"1px"}
                          borderColor={useColorModeValue("gray.200", "#333")}
                          direction="column"
                          gap={4}
                          p={4}
                        >
                          {/* action postion */}

                          <Flex
                            border={"1px"}
                            borderColor={useColorModeValue("gray.200", "#333")}
                            rounded="full"
                            cursor={"pointer"}
                            p={2}
                            _hover={{ borderColor: "red" }}
                            right={10}
                            top={2}
                            position={"absolute"}
                            onClick={() => reportDelete(report._id)}
                          >
                            {!isReportDeleting ? (
                              <AiOutlineDelete color="red" />
                            ) : (
                              isReportDeleting &&
                              reportId == report?._id && <Spinner />
                            )}
                          </Flex>

                          <Text fontStyle={"italic"} fontWeight={600}>
                            <a
                              onClick={() =>
                                router.push(`/account/${report?.reportBy?._id}`)
                              }
                            >
                              {report?.reportBy?.fullName}
                            </a>{" "}
                            reported{" "}
                            {!report?.reportedPost ? (
                              <a
                                onClick={() =>
                                  router.push(
                                    `/account/${report?.reportedUser?._id}`
                                  )
                                }
                              >
                                {report?.reportedUser?.fullName}
                              </a>
                            ) : report?.reportedPost?.type == "comment" ? (
                              <a
                                onClick={() =>
                                  router.push(
                                    `/post/comment/${report?.reportedPost?._id}`
                                  )
                                }
                              >
                                Post
                              </a>
                            ) : (
                              <a
                                onClick={() =>
                                  router.push(
                                    `/post/${report?.reportedPost?._id}`
                                  )
                                }
                              >
                                Post
                              </a>
                            )}
                          </Text>
                          <Text fontSize={14}>Reason :</Text>
                          <Text fontSize={14}>{report?.reason}</Text>
                        </Flex>
                      )
                    })}

                  {reportData.length == 0 && (
                    <Text fontSize={14} textAlign="center">
                      Nothing to show
                    </Text>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </WithHeader>
        </>
      )}
    </>
  )
}

export default Admin

export const getServerSideProps = async ({ req, res }) => {
  if (!req.cookies.session) {
    return {
      redirect: {
        destination: "/login",
      },
      props: { isLogin: true },
    }
  }
  return {
    props: { isLogin: false },
  }
}