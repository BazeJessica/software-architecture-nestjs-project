import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class SQLiteNotificationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
