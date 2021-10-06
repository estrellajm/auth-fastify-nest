import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.entity';
import { JwtStrategy } from '../../core/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'users'
    ),
    JwtModule.register({
      secret: 'reallyDifficult',
      signOptions: { expiresIn: '24h' }
    })
  ],
  providers: [UserService, UserResolver, JwtStrategy]
})
export class UserModule {}
