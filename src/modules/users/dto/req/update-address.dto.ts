import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateAddressDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly street: string = '';

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly city: string = '';

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly country: string = '';
}
