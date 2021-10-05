import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateUser {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  createdAt: string = new Date().toISOString();
}

@InputType()
export class UpdateUser extends PartialType(
  OmitType(CreateUser, ['password', 'createdAt'] as const)
) {}
