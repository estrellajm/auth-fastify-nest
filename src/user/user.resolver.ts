import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { CreateUserInput, UpdateUserInput } from './user-inputs.dto';
import { CurrentUser } from './user.decorator';
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
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    try {
      return await this.userService.login(email, password);
    } catch (error) {
      console.log(error);
    }
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async findAllUsers() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => User)
  async updateUserInput(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput
  ) {
    try {
      return await this.userService.updateUser(updateUserInput);
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => User)
  async updateUserPassword(
    @CurrentUser() user: User,
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string
  ) {
    try {
      return await this.userService.updatePassword(
        user._id,
        currentPassword,
        newPassword
      );
    } catch (error) {
      console.log(error);
    }
  }

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    return await this.userService.findOne(_id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async removeUser(@Args('_id') _id: string) {
    try {
      return await this.userService.removeUser(_id);
    } catch (error) {
      console.log(error);
    }
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async currentUser(@CurrentUser() user: User) {
    try {
      return await this.userService.findOne(user._id);
    } catch (error) {
      console.log(error);
    }
  }
}
