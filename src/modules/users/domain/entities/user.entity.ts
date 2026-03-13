import { v4 } from 'uuid';
import { Permissions } from '../permissions/permissions';
import { UserUsername } from '../value-objects/user-username.value-object';

export type UserRole = 'user' | 'moderator' | 'admin' | 'writer';

export class UserEntity {
  private _username: UserUsername;
  private _role: UserRole;
  private _password: string;

  private _following: string[];
  private _followers: string[];

  public get role(): UserRole {
    return this._role;
  }

  public get following(): string[] {
    return this._following;
  }

  public get followers(): string[] {
    return this._followers;
  }

  public readonly permissions: Permissions;

  private constructor(
    readonly id: string,
    username: UserUsername,
    role: UserRole,
    password: string,
    following: string[] = [],
    followers: string[] = [],
  ) {
    this._username = username;
    this._role = role;
    this._password = password;
    this._following = following;
    this._followers = followers;

    this.permissions = new Permissions(this.id, role);
  }

  public static create(
    username: string,
    role: UserRole,
    password: string,
  ): UserEntity {
    return new UserEntity(v4(), new UserUsername(username), role, password);
  }

  public toJSON() {
    return {
      id: this.id,
      role: this._role,
      username: this._username.toString(),
      password: this._password,
      following: this._following,
      followers: this._followers,
    };
  }

  public update(username?: string, role?: UserRole): void {
    if (username) {
      this._username = new UserUsername(username);
    }
    if (role) {
      this._role = role;
    }
  }

  public follow(userId: string) {
    if (!this._following.includes(userId)) {
      this._following.push(userId);
    }
  }

  public unfollow(userId: string) {
    this._following = this._following.filter(id => id !== userId);
  }

  public static reconstitute(input: Record<string, unknown>): UserEntity {
    return new UserEntity(
      input.id as string,
      new UserUsername(input.username as string),
      input.role as UserRole,
      input.password as string,
      (input.following as string[]) || [],
      (input.followers as string[]) || [],
    );
  }

  public checkPassword(password: string): boolean {
    return this._password === password;
  }
}
