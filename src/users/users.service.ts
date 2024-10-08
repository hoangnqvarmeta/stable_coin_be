import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/relational/repositories/user.repository';
import { User } from './domain/user';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { infinityPagination } from '../utils/infinity-pagination';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async findAllWithPagination(query: QueryUserDto) {
    const [data, count] =
      await this.userRepository.findAllWithPagination(query);
    return infinityPagination(
      data,
      { page: query.page, limit: query.limit },
      Math.ceil(count / query.limit),
    );
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
