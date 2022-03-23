import React from 'react'
import {
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { Carousel } from "react-responsive-carousel"


const GalleryModal = ({
  isModalOpen,
  setIsModalOpen,
  setCurrentImageArray,
  currentImageArray,
  selectedItem,
setSelectedItem
}) => {
  return (
    <>
      <Modal
        size={"5xl"}
        
        isOpen={isModalOpen}
        onClose={() => {
          setCurrentImageArray([])
          setSelectedItem(0)
          setIsModalOpen(!isModalOpen)
        }}
      >
        <ModalOverlay />
        <ModalContent maxHeight={"90%"} padding={10}>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />

          <Carousel selectedItem={selectedItem}>
            {currentImageArray.map((item, inx) => {
              return (
                <div style={{height: 400, overflow: "auto"}} key={inx}>
                  <img alt={item.name} src={item.img} />
                </div>
              )
            })}
          </Carousel>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GalleryModal