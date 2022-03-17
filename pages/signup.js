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
  Alert,
  AlertIcon,
  AlertTitle,
  useToast,
} from "@chakra-ui/react"

import * as Yup from "yup"

import { useRouter } from "next/router"
import UnAuth from "../components/base/UnAuth"
import axios from "axios"
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

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const toast = useToast({ position: "top" })

  const signupHandler = async (values) => {
    setIsLoading(true)

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/signup`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      setIsLoading(false)
      toast({
        status: "success",
        duration: 3000,
        title:
          data.message,
      })
      router.push("/login")
    } catch (e) {
      setIsLoading(false)
      const errorMsg = e.response
        ? e.response.data.message
        : "Something went wrong!!!"

      toast({
        status: "error",
        duration: 5000,
        title: errorMsg,
      })
    }
  }

  return (
    <UnAuth>
      <Flex
        minH={"100vh"}
        width={"100%"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create a new account!</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
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
                        isLoading={isLoading}
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

              <Stack
                mt={5}
                direction={{ base: "column" }}
                align={"start"}
                justify={"center"}
              >
                <p>
                  Already have an account?{" "}
                  <a onClick={() => router.push("/login")}>Login!</a>
                </p>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </UnAuth>
  )
}

export default Signup
