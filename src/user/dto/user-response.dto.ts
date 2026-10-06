import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}
