import React from 'react'
import {Flex} from '@chakra-ui/react'
import UserAccount from '../../components/base/UserAccount'

const UserId = () => {

  return (
    <Flex w={"100%"} mt={10} mr={[0, 100, 150]}>
      <UserAccount/>
    </Flex>
  )
}
// 

export default UserId