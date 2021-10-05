import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateUserInput } from './user-inputs.dto';
import { User } from './user.entity';
import { GqlAuthGuard } from './user.guard';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    try {
      return await this.userService.createUser(createUserInput);
    } catch (err) {
      console.log(err);
    }
  }

  @Mutation(() => User)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    console.log(email, password);

    try {
      return await this.userService.login(email, password);
    } catch (err) {
      console.log(err);
    }
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async findAllUsers() {
    try {
      return await this.userService.findAll();
    } catch (err) {
      console.log(err);
    }
  }
}
