export class ValidateCommentContent {
  private readonly value: string;

  constructor(name: string) {
    this.validate(name);
    this.value = name.trim();
  }

  private validate(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }

    if (name.length > 1000) {
      throw new Error('Comment content too long (max 1000 chars)');
    }

    if (name.length < 1) {
      throw new Error('Comment content too short (min 1 chars)');
    }
  }

  public toString(): string {
    return this.value;
  }
}
