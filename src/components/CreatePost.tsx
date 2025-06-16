import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useStore } from '../store/useStore';
import { LoadingModal } from './LoadingModal';
import { useApiCall } from '../hooks/useApiCall';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  sub_sov_id: string;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  isOpen,
  onClose,
  sub_sov_id,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user } = useStore();

  const { execute: createPost, isLoading } = useApiCall(
    async () => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await fetch('http://localhost:3006/create_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          user_sov_id: user.sov_id,
          sub_sov_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      return response.json();
    },
    {
      successMessage: 'Post created successfully!',
      errorMessage: 'Failed to create post. Please try again.',
      onSuccess: () => {
        setTitle('');
        setContent('');
        onClose();
      },
    }
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createPost();
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Create Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter post title"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Write your post content here..."
                    rows={6}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isLoading}
                loadingText="Creating..."
              >
                Create Post
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <LoadingModal
        isOpen={isLoading}
        message="Creating your post..."
      />
    </>
  );
}; 