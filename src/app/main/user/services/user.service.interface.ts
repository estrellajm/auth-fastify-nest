import { HttpException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { CreateUser, UpdateUser } from '../model/user.dto';
import { User } from '../model/user.entity';

export interface IUserService {
  createUser(
    createUser: CreateUser
  ): Promise<User | HttpException | GraphQLError>;
  login(
    email: string,
    password: string
  ): Promise<string | HttpException | GraphQLError>;
  logout(): Promise<string | HttpException | GraphQLError>;
  findOne(_id: Types.ObjectId): Promise<User | HttpException | GraphQLError>;
  findAll(): Promise<User[] | HttpException | GraphQLError>;
  removeUser(_id: string): Promise<User | HttpException | GraphQLError>;
  updateUser(
    _id: Types.ObjectId,
    updateUser: UpdateUser
  ): Promise<User | HttpException | GraphQLError>;
  updatePassword(
    _id: Types.ObjectId,
    currentPassword: string,
    newPassword: string
  ): Promise<User | HttpException | GraphQLError>;
}
