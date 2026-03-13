export const PostDeletedEvent = 'post.deleted';

export class PostDeletedEventPayload {
  postId: string;
  authorId: string;
  title: string;
  deleterId: string;
}
