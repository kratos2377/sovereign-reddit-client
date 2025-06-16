import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Text,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { useStore } from '../store/useStore';
import { LoadingModal } from './LoadingModal';
import { useApiCall } from '../hooks/useApiCall';

interface CommentSectionProps {
  post_sov_id: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ post_sov_id }) => {
  const [commentContent, setCommentContent] = useState('');
  const { user, comments, getPostComments, addComment } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  const { execute: fetchComments } = useApiCall(
    async () => {
      await getPostComments(post_sov_id);
    },
    {
      successMessage: 'Comments loaded successfully',
      errorMessage: 'Failed to load comments',
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    }
  );

  const { execute: submitComment, isLoading: isSubmitting } = useApiCall(
    async () => {
      if (!user) throw new Error('User not authenticated');
      await addComment(post_sov_id, user.sov_id, commentContent);
      setCommentContent('');
      await fetchComments();
    },
    {
      successMessage: 'Comment added successfully',
      errorMessage: 'Failed to add comment',
    }
  );

  React.useEffect(() => {
    fetchComments();
  }, [post_sov_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitComment();
  };

  return (
    <Box mt={8}>
      <Heading size="md" mb={4}>
        Comments
      </Heading>

      {user && (
        <Box as="form" onSubmit={handleSubmit} mb={6}>
          <FormControl>
            <FormLabel>Add a comment</FormLabel>
            <Textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write your comment here..."
              rows={3}
              mb={2}
            />
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Posting..."
            >
              Post Comment
            </Button>
          </FormControl>
        </Box>
      )}

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
              <Text>{comment.content}</Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Posted by {comment.user_sov_id} • {comment.score} points
              </Text>
            </Box>
          ))}
          {comments.length === 0 && (
            <Text color="gray.500">No comments yet. Be the first to comment!</Text>
          )}
        </VStack>
      )}
    </Box>
  );
}; 