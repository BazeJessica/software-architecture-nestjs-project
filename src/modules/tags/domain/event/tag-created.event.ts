export const TagCreatedEvent = 'tag.created';

export type TagCreatedEventPayload = {
  tagId: string;
  authorId: string;
};
