import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useStore } from '../store/useStore';
import { LoadingModal } from './LoadingModal';
import { useApiCall } from '../hooks/useApiCall';
import { PostVoting } from './PostVoting';

interface UserProfileProps {
  user_sov_id: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user_sov_id }) => {
  const { user, posts, comments, getUserPosts, getUserComments } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const { execute: fetchUserData } = useApiCall(
    async () => {
      if (activeTab === 0) {
        await getUserPosts(user_sov_id);
      } else {
        await getUserComments(user_sov_id);
      }
    },
    {
      successMessage: 'Data loaded successfully',
      errorMessage: 'Failed to load data',
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    }
  );

  useEffect(() => {
    setIsLoading(true);
    fetchUserData();
  }, [user_sov_id, activeTab]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            User Profile
          </Heading>
          <Text color="gray.500">User ID: {user_sov_id}</Text>
        </Box>

        <Tabs onChange={handleTabChange}>
          <TabList>
            <Tab>Posts</Tab>
            <Tab>Comments</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
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
                      <Heading size="md" mb={2}>
                        {post.title}
                      </Heading>
                      <Text mb={4}>{post.content}</Text>
                      <PostVoting
                        post_sov_id={post.post_sov_id}
                        score={post.score}
                      />
                    </Box>
                  ))}
                  {posts.length === 0 && (
                    <Text color="gray.500">No posts yet</Text>
                  )}
                </VStack>
              )}
            </TabPanel>

            <TabPanel>
              {isLoading ? (
                <LoadingModal isOpen={true} message="Loading comments..." />
              ) : (
                <VStack spacing={4} align="stretch">
                  {comments.map((comment) => (
                    <Box
                      key={comment.id}
                      p={4}
                      borderWidth={1}
                      borderRadius="md"
                      boxShadow="sm"
                    >
                      <Text mb={2}>{comment.content}</Text>
                      <Text fontSize="sm" color="gray.500">
                        Score: {comment.score}
                      </Text>
                    </Box>
                  ))}
                  {comments.length === 0 && (
                    <Text color="gray.500">No comments yet</Text>
                  )}
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}; 