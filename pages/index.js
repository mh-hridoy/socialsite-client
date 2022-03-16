import AuthRoute from "../components/base/AuthRoute";
import {Flex} from "@chakra-ui/react"

export default function Home() {
  return (
    <AuthRoute>
      <Flex mr={[0, 100, 150]} width={"100%"} >create post & feeds</Flex>
    </AuthRoute>
  )
}
