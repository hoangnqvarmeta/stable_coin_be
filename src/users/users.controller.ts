import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiDeleteResponse } from '../utils/swagger/ApiDeleteResponse';
import { ApiGetDetailResponse } from '../utils/swagger/ApiGetDetailResponse';
import { ApiUpdateResponse } from '../utils/swagger/ApiUpdateResponse';
import { User } from './domain/user';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiGetDetailResponse(User)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('me')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiGetDetailResponse(User)
  getMyProfile(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  @ApiUpdateResponse(User)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiDeleteResponse()
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
