import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { User } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './infrastructure/persistence/relational/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findOne(fields: FindOptionsWhere<User>) {
    return this.userRepository.findOne(fields);
  }

  findMany(options: FindManyOptions<User>) {
    return this.userRepository.findMany(options);
  }

  findById(id: User['id']) {
    return this.userRepository.findById(id);
  }

  update(id: User['id'], updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: User['id']) {
    return this.userRepository.remove(id);
  }
}
