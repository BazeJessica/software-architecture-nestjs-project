import { PostEntity } from '../../../posts/domain/entities/post.entity';
import { UserRole } from '../entities/user.entity';

export class TagPermissions {
  constructor(
    private readonly userId: string | null,
    private readonly role: UserRole | null,
  ) {}

  public canCreate(): boolean {
    return this.role === 'admin';
  }

  public canUpdate(): boolean {
    return this.role === 'admin';
  }

  public canDelete(): boolean {
    return this.role === 'admin';
  }

  public canView(): boolean {
    return true;
  }

  public canAddToPost(post: PostEntity): boolean {
    return this.role === 'admin' || post.authorId === this.userId;
  }

  public canRemoveFromPost(post: PostEntity): boolean {
    return this.role === 'admin' || post.authorId === this.userId;
  }
}
