import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  _id!: ObjectID;

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
