import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import UpdateAddressDTO from './update-address.dto';

export default class UpdateUserDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  readonly name: string = '';

  @ApiProperty({ type: UpdateAddressDTO })
  @IsNotEmpty()
  readonly address!: UpdateAddressDTO;
}
