import React from 'react'
import {Flex} from '@chakra-ui/react'
import UserAccount from '../../components/base/UserAccount'

const UserId = () => {

  return (
    <Flex alignItems={"center"} justifyContent="center" w={"100%"} pt={5}>
      <Flex w={["90%", "90%", "75%"]}>
        <UserAccount />
      </Flex>
    </Flex>
  )
}
// 

export default UserId