import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.entity';
import { CreateUserInput, UpdateUserInput } from './user-inputs.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private UserModel: Model<UserDocument>
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    try {
      const isUser = await this.UserModel.findOne({
        email: createUserInput.email
      });
      if (isUser) throw new GraphQLError('Nah bro, you already exist');
      createUserInput.password = await bcrypt
        .hash(createUserInput.password, 10)
        .then((r) => r);
      return await new this.UserModel(createUserInput).save();
    } catch (error) {
      console.log(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.UserModel.findOne({
        email: email
      });
      return user && (await bcrypt.compare(password, user.password))
        ? await this.jwtService.signAsync({ email, _id: user._id })
        : new GraphQLError('Nah homie, wrong email/password');
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    try {
      return await this.UserModel.find().exec();
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(_id: Types.ObjectId, updateUserInput: UpdateUserInput) {
    try {
      return await this.UserModel.findByIdAndUpdate(_id, updateUserInput, {
        new: true
      }).exec();
    } catch (error) {
      console.log(error);
    }
  }

  async updatePassword(
    _id: Types.ObjectId,
    currentPassword: string,
    newPassword: string
  ) {
    try {
      const User = await this.UserModel.findById(_id);
      if (await bcrypt.compare(currentPassword, User.password)) {
        if (await bcrypt.compare(newPassword, User.password))
          return new GraphQLError("you've enter the same password");
        User.password = await bcrypt.hash(newPassword, 10);
        return await new this.UserModel(User).save();
      }
      return new GraphQLError('Wrong password entered');
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(_id: Types.ObjectId) {
    try {
      return await this.UserModel.findById(_id);
    } catch (error) {
      console.log(error);
    }
  }

  async removeUser(_id: string) {
    try {
      return await this.UserModel.findByIdAndRemove(_id);
    } catch (error) {
      console.log(error);
    }
  }
}
