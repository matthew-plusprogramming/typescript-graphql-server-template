import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID, { complexity: 1 })
  @ObjectIdColumn()
    _id!: ObjectID;

  @Field({ complexity: 1 })
  @Column('text', { unique: true })
    email!: string;

  @Column()
    password!: string;

  @Field({ complexity: 1 })
  @Column()
    firstName!: string;

  @Field({ complexity: 1 })
  @Column()
    lastName!: string;

  @Field({ complexity: 1 })
  @Column()
    username!: string;

  @Column('bool', { default: false })
    confirmed!: boolean;
}
