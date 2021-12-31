import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class UserAuthTokens extends BaseEntity {
  @ObjectIdColumn()
  _id!: ObjectID;

  @Column('string')
  userId!: ObjectID;

  @Column()
  accessToken!: string;

  @Column()
  refreshToken!: string;

  @Column()
  securityKey!: string;
}
