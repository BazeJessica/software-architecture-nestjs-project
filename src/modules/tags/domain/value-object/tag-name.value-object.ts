export class TagName {
  private readonly value: string;

  constructor(name: string) {
    this.validate(name);
    this.value = name.trim();
  }

  private validate(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Tag name cannot be empty');
    }

    if (name.length > 50) {
      throw new Error('Tag name too long (max 50 chars)');
    }

    if (name.length < 2) {
      throw new Error('Tag name too short (min 2 chars)');
    }

    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(name)) {
      throw new Error(
        'TagName must only contain lowercase alphanumeric characters and hyphens',
      );
    }
  }

  public toString(): string {
    return this.value;
  }
}
