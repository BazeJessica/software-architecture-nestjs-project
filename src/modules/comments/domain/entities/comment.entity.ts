import { v4 } from 'uuid';
import { ValidateCommentContent } from '../value-object/comment.value-object';
export class CommentEntity {
    private _content: string;
    private _postId: string;
    private _authorId: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        readonly id:string;
        content: string,
        postId: string,
        authorId: string,
        createdAt: Date,
        updatedAt: Date,
    ){
        this._content = content;
        this._postId = postId;
        this._authorId = authorId;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }
    public get content(){
        return this._content;
    }
    public get postId(){
        return this._postId;
    }
    public get authorId(){
        return this._authorId;
    }
    public get createdAt(){
        return this._createdAt;
    }
    public get updatedAt(){
        return this._updatedAt;
    }
    public static create(content: string, postId: string, authorId: string): CommentEntity {
        const validatedContent = new ValidateCommentContent(content);
        if(validatedContent){
            content = validatedContent.toString();
        }
        const currentDate = new Date();
        return new CommentEntity(v4(), content, postId, authorId, currentDate, currentDate);
    }

    public static reconstitute(input: Record<string, unknown>): CommentEntity {
        return new CommentEntity(
            input.id as string,
            input.content as string,
            input.postId as string,
            input.authorId as string,
            new Date(input.createdAt as string | Date),
            new Date(input.updatedAt as string | Date),
        );
    }
    public update(content: string){
       const validatedContent = new ValidateCommentContent(content);
       if(validatedContent){
           this._content = validatedContent.toString();
           this._updatedAt = new Date();
       }
    }
    public toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            content: this._content,
            postId: this._postId,
            authorId: this._authorId,
            createdAt: this._createdAt.toISOString(),
            updatedAt: this._updatedAt.toISOString(),
        };
    }
}