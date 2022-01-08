import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  _id!: ObjectId;

  @Field()
  @Column('text', { unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column()
  firstName!: string;

  @Field()
  @Column()
  lastName!: string;

  @Field()
  @Column()
  username!: string;

  @Column('bool', { default: false })
  confirmed!: boolean;
}
