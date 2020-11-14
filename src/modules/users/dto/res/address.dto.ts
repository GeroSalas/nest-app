import { ApiProperty } from '@nestjs/swagger';

export default class AddressDTO {
  @ApiProperty({ type: String })
  readonly street!: string;

  @ApiProperty({ type: String })
  readonly city!: string;

  @ApiProperty({ type: String })
  readonly country!: string;
}
