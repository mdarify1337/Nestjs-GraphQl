// user.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserInput } from '../dto/create-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  // Query for fetching all users
  @Query(() => [User], { name: 'users' })
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Query for fetching a single user by ID
  @Query(() => User, { name: 'user' })
  async getUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  // Mutation for creating a new user
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.create(createUserInput);
  }

  // Mutation for updating a user
  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserInput') updateUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.update(id, updateUserInput);
  }

  // Mutation for deleting a user
  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.userService.remove(id);
  }
}
