import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // <-- Marks it as a GraphQL object type
@Entity()
export class User {
  @Field(() => Int) // <-- Specifies the GraphQL field type
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;
}
