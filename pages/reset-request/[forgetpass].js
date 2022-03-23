import React, { useState, useEffect } from "react"
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
  Spinner,
  useToast,
} from "@chakra-ui/react"
import * as Yup from "yup"
import { useRouter } from "next/router"
import axios from "axios"
import UnAuth from "../../components/base/UnAuth"

const resetSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be 8 character long.")
    .max(20, "Too Long Password!")
    .required("Password cannot be empty!"),

  cPassword: Yup.string().test(
    "passwords-match",
    "Passwords must match",
    function (value) {
      return this.parent.password === value
    }
  ),
})



const ResetRequest = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const toast = useToast({ position: "top", isClosable: true })
  let veriCode;

  const resetHandler = async (values) => {
    const verifyCode = router.query.forgetpass
    const {password} = values
    setIsLoading(true)

    try {
     const { data } = await axios.post(
       `${process.env.NEXT_PUBLIC_MAIN_PROXY}/reset-password`,
       { resetCode: verifyCode, password }
     )

      setIsLoading(false)
      toast({
        status: "success",
        duration: 5000,
        title: data,
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

  

  useEffect(() => {
    const code = window.location.pathname.split("/")
    veriCode = code[code.length - 1]
    checkCode()
  }, [])

  const checkCode = async() => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_MAIN_PROXY}/verify-code`,
          { resetCode: veriCode })
        
        setLoading(false)
      } catch (e) {
        router.push("/login")
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
    <>
      {loading ? (
        <Flex
          minW={"100vw"}
          alignItems={"center"}
          justifyContent="center"
          height={"90vh"}
        >
          <Spinner size={"xl"} />
        </Flex>
      ) : (
        <UnAuth>
          <Flex
            width={"100%"}
            minH={"100vh"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
          >
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
              <Stack align={"center"}>
                <Heading textAlign={"center"} fontSize={"4xl"}>
                  Setup a new password for your account!
                </Heading>
              </Stack>
              <Box
                rounded={"lg"}
                bg={useColorModeValue("white", "gray.700")}
                boxShadow={"lg"}
                p={8}
              >
                <Formik
                  validationSchema={resetSchema}
                  initialValues={{
                    password: "",
                    cPassword: "",
                  }}
                  onSubmit={resetHandler}
                >
                  {({ handleSubmit, errors, touched }) => (
                    <form onSubmit={handleSubmit}>
                      <VStack spacing={4} align="flex-start">
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

                        <FormControl>
                          <FormLabel htmlFor="cPassword">
                            Confirm Password
                          </FormLabel>
                          <Field
                            as={Input}
                            id="cPassword"
                            name="cPassword"
                            type="password"
                            variant="filled"
                          />
                          {errors.cPassword && touched.cPassword && (
                            <Alert
                              px={2}
                              py={1}
                              fontSize={12}
                              rounded
                              marginTop={2}
                              status="error"
                            >
                              <AlertIcon />
                              <AlertTitle>{errors.cPassword}</AlertTitle>
                            </Alert>
                          )}
                        </FormControl>

                        <Button
                          isLoading={isLoading}
                          type="submit"
                          bg="buttonColor"
                          isFullWidth
                        >
                          Reset Now
                        </Button>
                      </VStack>
                    </form>
                  )}
                </Formik>

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
      )}
    </>
  )
}

export default ResetRequest
