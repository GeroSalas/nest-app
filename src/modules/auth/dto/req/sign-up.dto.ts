import { IsNotEmpty, MinLength, MaxLength, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class SignUpDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(4)
  @MaxLength(64)
  readonly username: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(64)
  readonly password: string = '';

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly name: string = '';

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly address: string = '';

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly cityId: string = '';
}
