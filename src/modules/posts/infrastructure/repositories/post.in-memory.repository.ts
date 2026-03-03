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
}
