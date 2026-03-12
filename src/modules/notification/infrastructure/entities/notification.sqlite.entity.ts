import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import type { NotificationType } from '../../domain/entities/notification.entity';

@Entity('notifications')
export class SQLiteNotificationEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'text' })
  type: NotificationType;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column()
  ownerId: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
