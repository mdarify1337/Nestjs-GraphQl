<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

Here’s a quick-start guide to using NestJS with GraphQL, 
from setting up the project to defining schemas, resolvers, and running queries and mutations.

NestJS + GraphQL Documentation
1. Project Setup

  1-Install NestJS: First, ensure that you have the Nest CLI installed.
  ```bash
  npm i -g @nestjs/cli
  ```
  2-Create a New Project:
  ```bash
  nest new my-graphql-app
  ```
  3-Install GraphQL and Apollo Server Dependencies:
  ```bash
  npm install @nestjs/graphql @nestjs/apollo graphql apollo-server-express
  ```
  4-Install Database ORM (Optional but recommended for database operations):
  ```bash
  npm install @nestjs/typeorm typeorm sqlite3
  ```


2. Configure GraphQL Module
  ```tsx
  import { Module } from '@nestjs/common';
  import { GraphQLModule } from '@nestjs/graphql';
  import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
  
  @Module({
    imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: 'schema.gql',  // generates schema file automatically
        playground: true,              // enables GraphQL Playground for testing
      }),
      // other modules like TypeOrmModule here if needed
    ],
  })
  export class AppModule {}
  ```

3. Create a Database Entity
If you’re using a database, set up an entity in the user.entity.ts file under a user folder.
  ```tsx
  import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    email: string;
  }
```
4. Define GraphQL Object Type (DTO)
Define GraphQL Object Types in user/user.type.ts.
```tsx
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;
}
```
5. Create Input Types for Mutations
In user/user.input.ts, define input types for createUser and updateUser mutations.
```tsx
  import { InputType, Field } from '@nestjs/graphql';
  
  @InputType()
  export class CreateUserInput {
    @Field()
    name: string;
  
    @Field()
    email: string;
  }
  
  @InputType()
  export class UpdateUserInput {
    @Field()
    name?: string;
  
    @Field()
    email?: string;
  }
```
6. Create the User Resolver
In user/user.resolver.ts, create queries and mutations.
```tsx
  import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
  import { UserService } from './user.service';
  import { UserType } from './user.type';
  import { CreateUserInput, UpdateUserInput } from './user.input';
  
  @Resolver(() => UserType)
  export class UserResolver {
    constructor(private userService: UserService) {}
  
    @Query(() => [UserType])
    async users() {
      return this.userService.findAll();
    }
  
    @Query(() => UserType, { nullable: true })
    async user(@Args('id') id: number) {
      return this.userService.findOne(id);
    }
  
    @Mutation(() => UserType)
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
      return this.userService.create(createUserInput);
    }
  
    @Mutation(() => UserType, { nullable: true })
    async updateUser(
      @Args('id') id: number,
      @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ) {
      return this.userService.update(id, updateUserInput);
    }
  
    @Mutation(() => Boolean)
    async deleteUser(@Args('id') id: number) {
      return this.userService.remove(id);
    }
  }
```
7. Implement User Service
In user/user.service.ts, define methods to handle data logic.
```tsx
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput, UpdateUserInput } from './user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    const newUser = this.userRepository.create(createUserInput);
    return this.userRepository.save(newUser);
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    await this.userRepository.update(id, updateUserInput);
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<boolean> {
    await this.userRepository.delete(id);
    return true;
  }
}
```
8. Testing Queries and Mutations
Use GraphQL Playground or VSCode REST Client to test.
Fetch All Users 
```graphql
query {
  users {
    id
    name
    email
  }
}
```
Fetch a User by ID
```graphql
query {
  user(id: 1) {
    id
    name
    email
  }
}
```
Create a New User
```graphql
mutation {
  createUser(createUserInput: { name: "John Doe", email: "john@example.com" }) {
    id
    name
    email
  }
}
```
Update a User
```graphql
mutation {
  updateUser(id: 1, updateUserInput: { name: "Jane Doe", email: "jane@example.com" }) {
    id
    name
    email
  }
}
```
