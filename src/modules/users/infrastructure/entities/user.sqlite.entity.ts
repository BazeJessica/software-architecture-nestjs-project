import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { type UserRole } from '../../domain/entities/user.entity';

@Entity('users')
export class SQLiteUserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column({ type: 'text' })
  role: UserRole;

  @Column()
  password: string;

  @ManyToMany(() => SQLiteUserEntity, user => user.followers, { cascade: true })
  @JoinTable({
    name: 'user_follows',
    joinColumn: { name: 'followerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'followingId', referencedColumnName: 'id' }
  })
  following: SQLiteUserEntity[];

  @ManyToMany(() => SQLiteUserEntity, user => user.following)
  followers: SQLiteUserEntity[];
}
