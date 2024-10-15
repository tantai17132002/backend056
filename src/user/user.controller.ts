import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  UseGuards,
  Request
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validationPipeOptions } from '../user/validation.pipe.config';
import { JwtAuthGuard } from './jwt.auth.guard';
import { CustomUserRequest } from './request.interface'; 
import { JwtPayload } from './user.interface';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('check-health')
  checkHealth(): string {
    return 'ok';
  }

  @Post('')
  // Use ValidationPipe
  @UsePipes(validationPipeOptions)
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('Received DTO:', createUserDto); // Log received data
    const user = await this.userService.create(createUserDto);
    return { id: user.id, username: user.username };
  }

  // Endpoint to get list of users
  @Get()
  async list() {
    return await this.userService.findAll();
  }

  // New endpoint to get logged-in user's information
  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getLoggedInUserInfo(@Request() req: CustomUserRequest) {
    const user = req.user; // This user object comes from JwtAuthGuard
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      gender: user.gender,
      phonenumber: user.phonenumber,
      age: user.age
    };
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.userService.findById(id);
    return user;
  }

  // Endpoint for user login
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const token = await this.userService.login(body.username, body.password);
    return {access_token: token} ; // Return token
  }

}

