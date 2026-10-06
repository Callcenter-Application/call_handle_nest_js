import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ResponseUserDto } from './dto/user-response.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { userInfo } from 'os';

const fakeDB: any[] = []

const findUser = (id: number) => {
  return fakeDB.find(user => (user.id === id) )
}

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
    const user = findUser(id)
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = findUser(id);
    
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    const userToDelete = fakeDB.findIndex(user => (user.id === id))
    fakeDB.splice(userToDelete, 1)
    return `This action removes a #${id} user`;
  }
}
