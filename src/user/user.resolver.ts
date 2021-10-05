import { HttpException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { CreateUser, UpdateUser } from './user.dto';
import { CurrentUser } from './current_user.decorator';
import { User } from './user.entity';
import { GqlAuthGuard } from './auth.guard';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUser') createUser: CreateUser
  ): Promise<User | GraphQLError> {
    try {
      return await this.userService.createUser(createUser);
    } catch (error) {
      console.log(error);
    }
  }

  @Query(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<string | HttpException | GraphQLError> {
    try {
      return await this.userService.login(email, password);
    } catch (error) {
      console.log(error);
    }
  }

  @Query(() => String)
  async logout(): Promise<string | GraphQLError> {
    try {
      return await this.userService.logout();
    } catch (error) {
      console.log(error);
    }
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async findAllUsers(): Promise<User[] | GraphQLError> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('updateUser') updateUser: UpdateUser
  ): Promise<User | GraphQLError> {
    try {
      return await this.userService.updateUser(user._id, updateUser);
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUserPassword(
    @CurrentUser() user: User,
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string
  ): Promise<User | GraphQLError> {
    try {
      console.log(user);

      if (!user) return new GraphQLError("Ain't no one signed it");
      return await this.userService.updatePassword(
        user._id,
        currentPassword,
        newPassword
      );
    } catch (error) {
      console.log(error);
    }
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('_id', { type: () => String }) _id: Types.ObjectId
  ): Promise<User | GraphQLError> {
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
