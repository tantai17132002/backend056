import { Injectable, NotFoundException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import {User} from './user.entity'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './user.interface'; 

// import { v4 as uuidv4 } from 'uuid'; // Use UUID library to generate id

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}

  // Password encryption function
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Create salt with 10 rounds
    return await bcrypt.hash(password, salt); // Encrypt password
  }

  // Function to check if username exists
  async isUsernameTaken(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } }); // Check username in users array
    return !!user; // Returns true if user exists, false otherwise
  }

  //New User Creation Function
  async create(createUserDto: CreateUserDto) {
    //Check if username is duplicated
    if (await this.isUsernameTaken(createUserDto.username)) {
      throw new HttpException(
        'Username already exists, please choose another username.',
        HttpStatus.BAD_REQUEST,
      );
    }

    //Encrypt passwords and create new users
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password), // Hash password
    });

    await this.userRepository.save(newUser); // Save user to database
    return newUser; // Returns the newly created user
  }

  // Function returns list of users
  async findAll() {
    return this.userRepository.find(); // Returns the list of users
  }

  // Function to find user by ID
  async findById(id: number): Promise<User> {
    // Kiểm tra xem userId có phải là số không
    if (isNaN(id)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOne(id: number): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ id }); // Truy vấn người dùng với ID
  }

  // Function to validate user credentials
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; // Return the full user entity if password matches
    }
    return null; // Return null if user not found or password is incorrect
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: user.id,          
      username: user.username,
      email: user.email,
      gender: user.gender,
      phonenumber: user.phonenumber,
      age: user.age,
    };

    return this.jwtService.sign(payload); // Sign and return the JWT
  }
}



