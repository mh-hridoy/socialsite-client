import AuthRoute from "../components/base/AuthRoute";
import {Flex} from "@chakra-ui/react"
import CreateNewFeed from "../components/custom/CreateNewFeed";

export default function Home() {
  return (
    <AuthRoute>
      <Flex alignItems={"center"} justifyContent="center" marginBottom={5}  w={"100%"} pt={5}>
        <Flex w={["90%", "90%", "75%"]}>

        <CreateNewFeed/>
        
         </Flex>
      </Flex>
    </AuthRoute>
  )
}
