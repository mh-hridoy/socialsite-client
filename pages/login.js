import React, { useState } from "react"
import { Formik, Field } from "formik"
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  useColorModeValue,
  Stack,
  Heading,
  Input,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  Text,
  useToast,
} from "@chakra-ui/react"
import * as Yup from "yup"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import axios from "axios"
import { login } from "../store/userInfoSlice"
import UnAuth from "../components/base/UnAuth"

const loginSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be 8 character long.")
    .max(20, "Too Long Password!")
    .required("Password cannot be empty!"),

  email: Yup.string()
    .email("Invalid email address!")
    .required("Email address is required!"),
})

const resetSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address!")
    .required("Email address is required!"),
})

const Login = () => {
  const [isForget, setIsForget] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const toast = useToast({ position: "top" })
  const dispatch = useDispatch()
  const [verifyMessage, setVerifyMessage] = useState(null)
  const [userID, setUserId] = useState(null)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const loginHandler = async (values) => {
    setIsLoading(true)

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/login`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      dispatch(login(data))
      localStorage.setItem("user", JSON.stringify(data))
      setIsLoading(false)
      router.push("/")
      toast({
        status: "success",
        duration: 3000,
        title: "Succesfully logged in!",
      })
    } catch (e) {
      setIsLoading(false)

      const errorMsg = e.response && e.response.data.message

      if (errorMsg.indexOf("Your email is not verified") == 0) {
        setVerifyMessage("Please verify your email to continue...")
        setUserId(errorMsg.split(".")[1])
      } else {
        toast({
          status: "error",
          duration: 5000,
          title: errorMsg || "Something went wrong!!!",
        })
      }
    }
  }

  const requestVerify = async () => {
    setVerifyLoading(!verifyLoading)

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/request-verify-email`,
        { id: userID },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
    setVerifyLoading(!verifyLoading)
    setVerifyMessage(null)
    setUserId(null)
      toast({
        status: "success",
        duration: 3000,
        title: data,
      })
    } catch (e) {
    setVerifyLoading(!verifyLoading)

      const errorMsg = e.response && e.response.data.message
      toast({
        status: "error",
        duration: 5000,
        title: errorMsg || "Something went wrong!!!",
      })
    }


  }

  const requestReset = async (values) => {
    setIsLoading(true)

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/reset-request`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      setIsLoading(false)
      setIsForget(!isForget)
      toast({
        status: "success",
        duration: 3000,
        title: data,
      })
    } catch (e) {
      setIsLoading(false)

      const errorMsg = e.response && e.response.data.message
      toast({
        status: "error",
        duration: 5000,
        title: errorMsg || "Something went wrong!!!",
      })
    }
  }

  return (
    <UnAuth>
      <Flex
        width={"100%"}
        minH={"100vh"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>
              {!isForget ? "Log in to your account" : "Forget Password"}
            </Heading>
            {isForget && (
              <Text textAlign={"center"}>
                You'll get an password reset email if you're already a user.
                Otherwise not!
              </Text>
            )}
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            {!isForget ? (
              <Formik
                validationSchema={loginSchema}
                initialValues={{
                  email: "",
                  password: "",
                }}
                onSubmit={loginHandler}
              >
                {({ handleSubmit, errors, touched }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                      {verifyMessage !== null && (
                        <Alert fontSize={12} fontWeight={600} status="warning">
                          <AlertIcon />
                          {verifyMessage}
                          {verifyLoading ? (
                            <Spinner size="sm" color="buttonColor" ml={2} />
                          ) : (
                            <a style={{marginLeft: 2}} onClick={requestVerify}>verify now</a>
                          )}
                        </Alert>
                      )}
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

                      <a onClick={() => setIsForget(!isForget)}>
                        Forgot password?
                      </a>

                      <Button
                        isLoading={isLoading}
                        type="submit"
                        bg="buttonColor"
                        isFullWidth
                      >
                        Login
                      </Button>
                    </VStack>
                  </form>
                )}
              </Formik>
            ) : (
              <Formik
                validationSchema={resetSchema}
                initialValues={{
                  email: "",
                }}
                onSubmit={requestReset}
              >
                {({ handleSubmit, errors, touched }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
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

                      <a onClick={() => setIsForget(!isForget)}>
                        Back to login?
                      </a>

                      <Button
                        isLoading={isLoading}
                        type="submit"
                        bg="buttonColor"
                        isFullWidth
                      >
                        Submit
                      </Button>
                    </VStack>
                  </form>
                )}
              </Formik>
            )}

            <Stack
              mt={10}
              direction={{ base: "column" }}
              align={"start"}
              justify={"center"}
            >
              <p>
                Don't have an account?{" "}
                <a onClick={() => router.push("/signup")}>Create one!</a>
              </p>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </UnAuth>
  )
}

export default Login
