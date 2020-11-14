import { ApiProperty } from '@nestjs/swagger';
import AddressDTO from './address.dto';

export default class ProfileUserDTO {
  @ApiProperty({ type: String })
  readonly id!: string;

  @ApiProperty({ type: String })
  readonly name!: string;

  @ApiProperty({ type: AddressDTO })
  readonly address!: AddressDTO;
}
