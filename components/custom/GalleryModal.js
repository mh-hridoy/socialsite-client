import React from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  ModalCloseButton,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Image,
  useToast
} from "@chakra-ui/react"
import { Carousel } from "react-responsive-carousel"
import { useSelector } from "react-redux"
import countReaction from "../utils/countReaction"
import { useRouter } from "next/router"
import { BsChatQuote, BsHeartFill, BsHeart } from "react-icons/bs"
import { AiOutlineComment } from "react-icons/ai"
import { RiStackshareLine } from "react-icons/ri"
import { FiShare } from "react-icons/fi"

const GalleryModal = ({
  isModalOpen,
  setIsModalOpen,
  setCurrentImageArray,
  currentImageArray,
  selectedItem,
  setSelectedItem,
  item,
  totalComment,
  quoteHandler,
  shareHandler,
  unSharehandler,
  unLikeHandler,
likeHandler
 
}) => {
  const user = useSelector((state) => state.user.user)
  const router = useRouter()
  const toast = useToast({ position: "top", isClosable: true })

  

  return (
    <>
      <Modal
        size={"full"}
        isOpen={isModalOpen}
        onClose={() => {
          setCurrentImageArray([])
          setSelectedItem(0)
          setIsModalOpen(!isModalOpen)
        }}
      >
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent
          shadow={"none"}
          alignItems={"center"}
          justifyContent="center"
          bg="none"
          width={["100%", "100%", "90%"]}
        >
          <ModalCloseButton
            zIndex={200}
            bg={useColorModeValue("white", "black")}
            _focus={{ boxShadow: "none" }}
          />
          <Carousel showIndicators={false} selectedItem={selectedItem}>
            {currentImageArray.map((item, inx) => {
              return item.type.includes("image") ? (
                <Flex key={inx}>
                  <Image
                    objectFit="contain"
                    height="600px"
                    width={"600px"}
                    border={"5px solid red"}
                    objectPosition={"center"}
                    alt={item.name}
                    src={item.img}
                  />
                </Flex>
              ) : (
                item.type.includes("video") && (
                  <video
                    style={{ cursor: "pointer" }}
                    src={item.img}
                    controls={true}
                    autoPlay={false}
                  ></video>
                )
              )
            })}
          </Carousel>

          <Flex
            style={{
              transform: "translateY(-100%)",
            }}
          >
            {user != null && (
              <Flex
                alignItems="center"
                justifyContent={"center"}
                width={"100%"}
              >
                <Flex
                  onClick={(e) => {
                    if (item.postType == "comment") {
                      router.push(`/post/comment/${item._id}`)
                    } else {
                      router.push(`/post/${item._id}`)
                    }
                  }}
                  // width={"100%"}
                  cursor="pointer"
                  px={10}
                  py={2}
                  gap={4}
                  alignItems="center"
                  justifyContent="center"
                >
                  <AiOutlineComment color="white" size={20} />
                  {item?.refComment?.length != 0 && (
                    <Text fontSize={14}>
                      {countReaction(totalComment || item?.refComment?.length)}
                    </Text>
                  )}
                </Flex>
                <Menu>
                  <MenuButton
                    variant="fill"
                    bg="transparent"
                    _active={{ bg: "transparent" }}
                    _hover={{ bg: "transparent" }}
                    as={Button}
                  >
                    <Flex gap={2}>
                      <RiStackshareLine
                        color={
                          item?.sharedBy?.includes(user._id)
                            ? "rgb(29, 155, 240)"
                            : "white"
                        }
                        size={18}
                      />
                      {item?.sharedBy?.length != 0 && (
                        <Text fontWeight={200} fontSize={14}>
                          {countReaction(
                            item?.sharedBy?.length + item?.quoteBy?.length || 0
                          )}
                        </Text>
                      )}
                    </Flex>
                  </MenuButton>{" "}
                  <MenuList fontSize={16}>
                    <MenuItem
                      onClick={
                        item?.sharedBy?.includes(user._id)
                          ? unSharehandler
                          : shareHandler
                      }
                      gap={2}
                    >
                      <RiStackshareLine size={16} />
                      <Text>
                        {item?.sharedBy?.includes(user._id)
                          ? "Unshare"
                          : "Share"}
                      </Text>
                    </MenuItem>

                    <MenuItem onClick={quoteHandler} gap={2}>
                      <BsChatQuote size={18} />
                      <Text>Quote Feed</Text>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Flex
                  gap={4}
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  px={10}
                  py={2}
                  onClick={
                    item?.reactedByUser &&
                    item?.reactedByUser?.includes(user && user._id)
                      ? unLikeHandler
                      : likeHandler
                  }
                >
                  {item?.reactedByUser &&
                  item?.reactedByUser?.includes(user && user._id) ? (
                    <BsHeartFill color="rgb(29, 155, 240)" />
                  ) : (
                    <BsHeart color="white" size={18} />
                  )}
                  {item?.reactedByUser?.length != 0 && (
                    <Text fontSize={14}>
                      {countReaction(item?.reactedByUser?.length)}
                    </Text>
                  )}
                </Flex>

                <Flex
                  gap={4}
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  px={10}
                  py={2}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      item.postType != "comment"
                        ? `${window.location.protocol}//${window.location.host}/post/${item?._id}`
                        : `${window.location.protocol}//${window.location.host}/post/comment/${item?._id}`
                    )

                    toast({
                      status: "success",
                      duration: 5000,
                      title: "Link copied to the clipboard.",
                    })
                  }}
                >
                  <FiShare color="white" size={18} />
                </Flex>
              </Flex>
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GalleryModal
