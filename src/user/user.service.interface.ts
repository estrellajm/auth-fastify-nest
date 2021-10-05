import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { CreateUser, UpdateUser } from './user-inputs.dto';
import { User } from './user.entity';

export interface IUserService {
  createUser(createUser: CreateUser): Promise<User>;
  login(email: string, password: string): Promise<string | GraphQLError>;
  logout(): Promise<string | GraphQLError>;
  updateUser(
    _id: Types.ObjectId,
    updateUser: UpdateUser
  ): Promise<User | GraphQLError>;
  updatePassword(
    _id: Types.ObjectId,
    currentPassword: string,
    newPassword: string
  ): Promise<User | GraphQLError>;
  findOne(_id: Types.ObjectId): Promise<User | GraphQLError>;
  findAll(): Promise<User[] | GraphQLError>;
  removeUser(_id: string): Promise<User | GraphQLError>;
}
