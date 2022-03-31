import React from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  ModalCloseButton,
  useColorModeValue,
  
  Image,
} from "@chakra-ui/react"
import { Carousel } from "react-responsive-carousel"

const GalleryModal = ({
  isModalOpen,
  setIsModalOpen,
  setCurrentImageArray,
  currentImageArray,
  selectedItem,
  setSelectedItem,
}) => {


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
        <ModalOverlay />
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
          <Carousel selectedItem={selectedItem}>
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

      

          {/* <Flex mt={5} >
          

          </Flex> */}
        </ModalContent>
      </Modal>
    </>
  )
}

export default GalleryModal
