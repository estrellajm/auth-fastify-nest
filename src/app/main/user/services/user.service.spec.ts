import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserDocument } from '../model/user.entity';
import { Model, Types } from 'mongoose';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useClass: Model
        }
      ],
      imports: [JwtModule.register({})]
    }).compile();

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
