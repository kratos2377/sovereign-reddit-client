import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useDisclosure,
  HStack,
} from '@chakra-ui/react';
import { useStore } from '../store/useStore';
import { CreatePost } from '../components/CreatePost';
import { CommentSection } from '../components/CommentSection';
import { PostVoting } from '../components/PostVoting';
import { LoadingModal } from '../components/LoadingModal';
import { useApiCall } from '../hooks/useApiCall';

export const SubredditPage: React.FC = () => {
  const { sub_sov_id } = useParams<{ sub_sov_id: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, posts, getSubredditPosts } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  const { execute: fetchPosts } = useApiCall(
    async () => {
      if (!sub_sov_id) throw new Error('Subreddit ID is required');
      await getSubredditPosts(sub_sov_id);
    },
    {
      successMessage: 'Posts loaded successfully',
      errorMessage: 'Failed to load posts',
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    }
  );

  useEffect(() => {
    fetchPosts();
  }, [sub_sov_id]);

  if (!sub_sov_id) {
    return <Text>Subreddit not found</Text>;
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={4}>Subreddit Posts</Heading>
          {user && (
            <Button colorScheme="blue" onClick={onOpen}>
              Create Post
            </Button>
          )}
        </Box>

        {isLoading ? (
          <LoadingModal isOpen={true} message="Loading posts..." />
        ) : (
          <VStack spacing={4} align="stretch">
            {posts.map((post) => (
              <Box
                key={post.post_sov_id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                boxShadow="sm"
              >
                <HStack justify="space-between" align="start" mb={2}>
                  <Heading size="md">{post.title}</Heading>
                  <PostVoting
                    post_sov_id={post.post_sov_id}
                    score={post.score}
                  />
                </HStack>
                <Text mb={4}>{post.content}</Text>
                <Text fontSize="sm" color="gray.500">
                  Posted by {post.user_sov_id} • {post.comments} comments
                </Text>
                <CommentSection post_sov_id={post.post_sov_id} />
              </Box>
            ))}
            {posts.length === 0 && (
              <Text color="gray.500">No posts yet. Be the first to post!</Text>
            )}
          </VStack>
        )}
      </VStack>

      <CreatePost
        isOpen={isOpen}
        onClose={onClose}
        sub_sov_id={sub_sov_id}
      />
    </Container>
  );
}; 