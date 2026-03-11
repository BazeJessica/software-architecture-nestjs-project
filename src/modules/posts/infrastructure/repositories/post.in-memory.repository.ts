import { Injectable } from '@nestjs/common';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class InMemoryPostRepository implements PostRepository {
  private posts: Record<string, unknown>[] = [];

  public getPosts(): PostEntity[] {
    console.log('InMemoryPostRepository.getPosts');
    return this.posts.map((post) => PostEntity.reconstitute(post));
  }

  public getPostById(id: string) {
    const post = this.posts.find((post) => post.id === id);

    if (post) {
      return PostEntity.reconstitute(post);
    }
  }

  public createPost(input: PostEntity) {
    this.posts.push(input.toJSON());
  }

  public updatePost(id: string, input: PostEntity) {
    this.posts = this.posts.map((post) => {
      if (post.id !== id) {
        return post;
      }

      return input.toJSON();
    });
  }

  public deletePost(id: string) {
    this.posts = this.posts.filter((post) => post.id !== id);
  }

  public async submitPostForReview(id: string): Promise<void> {
    const postRecord = this.posts.find((p) => p.id === id);
    if (postRecord) {
      const post = PostEntity.reconstitute(postRecord);
      post.submitForReview();
      this.updatePost(id, post);
    }
  }

  public async approvePost(id: string): Promise<void> {
    const postRecord = this.posts.find((p) => p.id === id);
    if (postRecord) {
      const post = PostEntity.reconstitute(postRecord);
      post.approve();
      this.updatePost(id, post);
    }
  }

  public async rejectPost(id: string): Promise<void> {
    const postRecord = this.posts.find((p) => p.id === id);
    if (postRecord) {
      const post = PostEntity.reconstitute(postRecord);
      post.reject();
      this.updatePost(id, post);
    }
  }
}
