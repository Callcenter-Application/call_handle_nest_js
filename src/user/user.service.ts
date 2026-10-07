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

const findUserIndex = (id: number) => {
  return fakeDB.findIndex(user => (user.id === id))
}

@Injectable()
export class UserService {
  
  create(createUserDto: CreateUserDto) {
    fakeDB.push(createUserDto)
    return createUserDto;
  }

  findAll() {
    return fakeDB;
  }

  findOne(id: number) {
    const user = findUser(id)
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = findUserIndex(id)
    fakeDB[userToUpdate] = updateUserDto
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    const userToDelete = findUserIndex(id)
    fakeDB.splice(userToDelete, 1)
    return `This action removes a #${id} user`;
  }
}
