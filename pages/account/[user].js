import React from 'react'
import {Flex, Avatar, Text} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import UserAccount from '../../components/base/UserAccount'

const UserId = () => {
  const user = useSelector((state) => state.user.user)

  return (
    <Flex w={"100%"} mt={10} mr={[0, 100, 150]}>
      <UserAccount/>
    </Flex>
  )
}
// 

export default UserId