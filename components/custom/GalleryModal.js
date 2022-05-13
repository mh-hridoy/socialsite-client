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
  useToast,
  Show
} from "@chakra-ui/react"
import { Carousel } from "react-responsive-carousel"
import { useSelector } from "react-redux"
import countReaction from "../utils/countReaction"
import { useRouter } from "next/router"
import { BsChatQuote, BsHeartFill, BsHeart } from "react-icons/bs"
import { AiOutlineComment } from "react-icons/ai"
import { RiStackshareLine } from "react-icons/ri"
import { FiShare } from "react-icons/fi"
import PostId from "../../pages/post/[postid]"
import PostSlide from "../base/PostSlide"

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
  likeHandler,
  quoteData,
  setQuoteData,
  setIsCreateModalOpen,
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
          flexDirection={"row"}
          shadow={"none"}
          bg="none"
          width="100%"
        >
          <ModalCloseButton
            zIndex={200}
            bg={useColorModeValue("white", "black")}
            _focus={{ boxShadow: "none" }}
          />

          <Flex
            justifyContent={"center"}
            alignItems="center"
            width={"100%"}
            columnGap={4}
          >
            <Flex flexDir={"column"}>
              <Carousel
                showStatus={false}
                showIndicators={false}
                selectedItem={selectedItem}
              >
                {currentImageArray.map((item, inx) => {
                  return item.type.includes("image") ? (
                    <Flex key={inx}>
                      <Image
                        objectFit="contain"
                        height="600px"
                        width={"600px"}
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

              <Flex>
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
                        <Text color="white" fontSize={14}>
                          {countReaction(
                            totalComment || item?.refComment?.length
                          )}
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
                            <Text color="white" fontWeight={200} fontSize={14}>
                              {countReaction(
                                item?.sharedBy?.length +
                                  item?.quoteBy?.length || 0
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
                        <Text color="white" fontSize={14}>
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
            </Flex>
          </Flex>

          <Show above="lg">
            <Flex
              bg={useColorModeValue("white", "#1A202C")}
              // bg="white"
              height="100vh"
              width={"50%"}
              overflow="auto"
            >
              {/* <PostId
                setQuoteData={setQuoteData}
                quoteData={quoteData}
                itemId={item._id}
              /> */}

              <PostSlide
                setQuoteData={setQuoteData}
                quoteData={quoteData}
                setIsCreateModalOpen={setIsCreateModalOpen}
                itemId={item._id}
              />
            </Flex>
          </Show>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GalleryModal
