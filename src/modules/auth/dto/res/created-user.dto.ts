import { ApiProperty } from '@nestjs/swagger';

export default class CreatedUserDTO {
  @ApiProperty({ type: String })
  readonly id!: string;
}
