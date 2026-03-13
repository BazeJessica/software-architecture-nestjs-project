export const PostStatusChangedEvent = 'post.status-changed';

export type PostStatusChangedEventPayload = {
  postId: string;
  authorId: string;
  title: string;
  previousStatus: string;
  newStatus: string;
};
