import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useStore } from '../store/useStore';
import { LoadingModal } from './LoadingModal';
import { useApiCall } from '../hooks/useApiCall';

interface SubredditManagementProps {
  sub_sov_id: string;
}

export const SubredditManagement: React.FC<SubredditManagementProps> = ({
  sub_sov_id,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subDescription, setSubDescription] = useState('');
  const { user, userSubs, fetchUserSubs, joinOrUnjoinSub } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  const { execute: fetchSubData } = useApiCall(
    async () => {
      if (!user) throw new Error('User not authenticated');
      await fetchUserSubs(user.sov_id);
    },
    {
      successMessage: 'Subreddit data loaded successfully',
      errorMessage: 'Failed to load subreddit data',
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    }
  );

  const { execute: handleJoinOrUnjoin, isLoading: isJoining } = useApiCall(
    async () => {
      if (!user) throw new Error('User not authenticated');
      await joinOrUnjoinSub(user.sov_id, sub_sov_id);
      await fetchSubData();
    },
    {
      successMessage: 'Subreddit status updated successfully',
      errorMessage: 'Failed to update subreddit status',
    }
  );

  useEffect(() => {
    if (user) {
      fetchSubData();
    }
  }, [user, sub_sov_id]);

  const isJoined = userSubs.some((sub) => sub.sub_sov_id === sub_sov_id);

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSubDescription(e.target.value);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <HStack justify="space-between" align="center">
            <Heading size="lg">Subreddit Management</Heading>
            {user && (
              <Button
                colorScheme={isJoined ? 'red' : 'blue'}
                onClick={() => handleJoinOrUnjoin()}
                isLoading={isJoining}
              >
                {isJoined ? 'Leave Subreddit' : 'Join Subreddit'}
              </Button>
            )}
          </HStack>
        </Box>

        {isLoading ? (
          <LoadingModal isOpen={true} message="Loading subreddit data..." />
        ) : (
          <VStack spacing={4} align="stretch">
            <Box p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
              <Heading size="md" mb={2}>
                Subreddit Information
              </Heading>
              <Text>Subreddit ID: {sub_sov_id}</Text>
              <Text mt={2}>Description: {subDescription}</Text>
            </Box>

            {isJoined && (
              <Button colorScheme="blue" onClick={onOpen}>
                Edit Description
              </Button>
            )}
          </VStack>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Subreddit Description</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={subDescription}
                onChange={handleDescriptionChange}
                placeholder="Enter subreddit description..."
                rows={4}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}; 