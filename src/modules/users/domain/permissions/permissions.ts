import { UserRole } from '../entities/user.entity';
import { PostPermissions } from './post-permissions';
import { TagPermissions } from './tag-permissions';

export class Permissions {
  public readonly posts: PostPermissions;
  public readonly tags: TagPermissions;

  constructor(userId: string, role: UserRole) {
    this.posts = new PostPermissions(userId, role);
    this.tags = new TagPermissions(userId, role);
  }
}
