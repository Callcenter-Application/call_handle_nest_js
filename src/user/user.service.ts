import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

const fakeDB: any[] = []

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    fakeDB.push(createUserDto)
    return 'This action adds a new user';
  }

  findAll() {
    return fakeDB;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
