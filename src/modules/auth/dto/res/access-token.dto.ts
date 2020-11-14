import { ApiProperty } from '@nestjs/swagger';

export default class AccessTokenDTO {
  @ApiProperty({ type: String })
  readonly accessToken!: string;
}
