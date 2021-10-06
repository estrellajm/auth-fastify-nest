import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../model/user.entity';
import { CreateUser, UpdateUser } from '../model/user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { IUserService } from './user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createUser(createUser: CreateUser) {
    try {
      const isUser = await this.userModel.findOne({
        email: createUser.email
      });
      if (isUser)
        throw new HttpException(
          'User already exist, try resetting your password',
          HttpStatus.FORBIDDEN
        );
      createUser.password = await bcrypt
        .hash(createUser.password, 10)
        .then((r) => r);
      return await new this.userModel(createUser).save();
    } catch (error) {
      return new GraphQLError(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({
        email: email
      });
      return user && (await bcrypt.compare(password, user.password))
        ? await this.jwtService.signAsync({ email, _id: user._id })
        : new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    } catch (error) {
      return new GraphQLError(error);
    }
  }

  async logout() {
    try {
      //TODO: need to move TOKEN to BLACKLIST
      return await Promise.resolve(undefined);
    } catch (error) {
      return new GraphQLError(error);
    }
  }

  async findAll() {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      return new GraphQLError(error);
    }
  }

  async updateUser(_id: Types.ObjectId, updateUser: UpdateUser) {
    try {
      return await this.userModel
        .findByIdAndUpdate(_id, updateUser, {
          new: true
        })
        .exec();
    } catch (error) {
      return new GraphQLError(error);
    }
  }

  async updatePassword(
    _id: Types.ObjectId,
    currentPassword: string,
    newPassword: string
  ): Promise<User | GraphQLError> {
    try {
      const User = await this.userModel.findById(_id);
      if (await bcrypt.compare(currentPassword, User.password)) {
        if (await bcrypt.compare(newPassword, User.password))
          return new GraphQLError("you've enter the same password");
        User.password = await bcrypt.hash(newPassword, 10);
        return await new this.userModel(User).save();
      }
      return new GraphQLError('Wrong password entered');
    } catch (error) {
      return new GraphQLError(error);
    }
  }

  async findOne(_id: Types.ObjectId) {
    try {
      return await this.userModel.findById(_id);
    } catch (error) {
      return new GraphQLError(error);
    }
  }

  async removeUser(_id: string) {
    try {
      return await this.userModel.findByIdAndRemove(_id);
    } catch (error) {
      return new GraphQLError(error);
    }
  }
}
