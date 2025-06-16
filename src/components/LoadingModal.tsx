import React from 'react';
import { Modal, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingModalProps {
  isOpen: boolean;
  message: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} closeOnOverlayClick={false}>
      <VStack
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        spacing={4}
      >
        <Spinner size="xl" color="blue.500" />
        <Text fontSize="lg" fontWeight="medium">
          {message}
        </Text>
      </VStack>
    </Modal>
  );
}; 