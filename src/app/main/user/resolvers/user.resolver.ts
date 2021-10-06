import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { CreateUser, UpdateUser } from '../model/user.dto';
import { CurrentUser } from '../decorators/current_user.decorator';
import { User } from '../model/user.entity';
import { GqlAuthGuard } from '../../../core/guards/auth.guard';
import { UserService } from '../services/user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('createUser') createUser: CreateUser) {
    return await this.userService.createUser(createUser);
  }

  @Query(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    return await this.userService.login(email, password);
  }

  @Query(() => String)
  async logout() {
    return await this.userService.logout();
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async currentUser(@CurrentUser() user: User) {
    return await this.userService.findOne(user._id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('updateUser') updateUser: UpdateUser
  ) {
    return await this.userService.updateUser(user._id, updateUser);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUserPassword(
    @CurrentUser() user: User,
    @Args('currentPassword') currPass: string,
    @Args('newPassword') newPass: string
  ) {
    return await this.userService.updatePassword(user._id, currPass, newPass);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    return await this.userService.findOne(_id);
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async findAllUsers() {
    return await this.userService.findAll();
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async removeUser(@Args('_id') _id: string) {
    return await this.userService.removeUser(_id);
  }
}
