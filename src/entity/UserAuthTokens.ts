import { ObjectId } from 'mongodb';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class UserAuthTokens extends BaseEntity {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column('string')
  userId!: ObjectId;

  @Column()
  accessToken!: string;

  @Column()
  refreshToken!: string;

  @Column()
  securityKey!: string;
}
