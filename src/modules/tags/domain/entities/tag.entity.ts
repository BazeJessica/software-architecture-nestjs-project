import { v4 } from 'uuid';
import { TagName } from '../value-object/tag-name.value-object';

export class TagEntity {
  private _name: TagName;
  private _createdAt: Date;

  private constructor(
    readonly id: string,
    name: TagName,
    createdAt: Date,
  ) {
    this._name = name;
    this._createdAt = createdAt;
  }
  public get name(): string {
    return this._name.toString();
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public static create(_name: string): TagEntity {
    return new TagEntity(v4(), new TagName(_name), new Date());
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new TagEntity(
      input.id as string,
      new TagName(input.name as string),
      new Date(input.createdAt as string | Date),
    );
  }
  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this._name.toString(),
      createdAt: this._createdAt.toISOString(),
    };
  }

  public update(name: string): void {
    if (name) {
      this._name = new TagName(name);
    }
  }
}
