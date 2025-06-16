import React from 'react';
import { HStack, IconButton, Text } from '@chakra-ui/react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useStore } from '../store/useStore';
import { useApiCall } from '../hooks/useApiCall';

interface PostVotingProps {
  post_sov_id: string;
  score: number;
  userVote?: number;
}

export const PostVoting: React.FC<PostVotingProps> = ({
  post_sov_id,
  score,
  userVote = 0,
}) => {
  const { user, likeOrDislikePost } = useStore();

  const { execute: handleVote, isLoading } = useApiCall(
    () => {
      if (!user) throw new Error('User not authenticated');
      return Promise.resolve();
    },
    {
      successMessage: 'Vote recorded successfully',
      errorMessage: 'Failed to record vote',
    }
  );

  const handleUpvote = async () => {
    if (!user) return;
    if (userVote === 1) {
      await likeOrDislikePost(user.sov_id, post_sov_id, 0); // Remove upvote
    } else {
      await likeOrDislikePost(user.sov_id, post_sov_id, 1); // Add upvote
    }
    await handleVote();
  };

  const handleDownvote = async () => {
    if (!user) return;
    if (userVote === -1) {
      await likeOrDislikePost(user.sov_id, post_sov_id, 0); // Remove downvote
    } else {
      await likeOrDislikePost(user.sov_id, post_sov_id, -1); // Add downvote
    }
    await handleVote();
  };

  return (
    <HStack spacing={2}>
      <IconButton
        aria-label="Upvote"
        icon={<FaArrowUp />}
        size="sm"
        colorScheme={userVote === 1 ? 'blue' : 'gray'}
        onClick={handleUpvote}
        isLoading={isLoading}
        isDisabled={!user}
      />
      <Text fontWeight="medium">{score}</Text>
      <IconButton
        aria-label="Downvote"
        icon={<FaArrowDown />}
        size="sm"
        colorScheme={userVote === -1 ? 'red' : 'gray'}
        onClick={handleDownvote}
        isLoading={isLoading}
        isDisabled={!user}
      />
    </HStack>
  );
}; 