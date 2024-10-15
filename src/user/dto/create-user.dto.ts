import {
  IsEmail,
  IsNotEmpty,
  ValidationArguments,
  IsNumber,
  IsString,
  MinLength,
  Matches,
  Min,
  IsIn,
} from 'class-validator';
import { ValidationMessages } from '../validation_messages';

//Definition of the IsRequired function
const IsRequired = () =>
  IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `${args.property} is required.`;
    },
  });

export class CreateUserDto {
  @IsRequired()
  @IsString()
  @MinLength(3, { message: ValidationMessages.USERNAME_MIN_LENGTH })
  username: string;

  @IsRequired()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/, {
    message: ValidationMessages.PASSWORD_COMPLEXITY,
  })
  password: string;

  @IsRequired()
  @IsEmail({}, { message: ValidationMessages.INVALID_EMAIL })
  email: string;

  @IsRequired()
  @IsIn([0, 1], { message: ValidationMessages.GENDER_NUMBER })
  gender: number;

  @IsRequired()
  @IsString()
  @Matches(/^\d{10}$/, { message: ValidationMessages.PHONE_NUMBER_FORMAT })
  phonenumber: string;

  @IsRequired()
  @IsNumber({}, { message: ValidationMessages.AGE_NUMBER })
  @Min(18, { message: ValidationMessages.AGE_MIN })
  age: number;
}
