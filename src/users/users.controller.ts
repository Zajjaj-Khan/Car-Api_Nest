import { Controller,Post,Body,Get,Patch,Param,Query, Delete,Session,UseGuards} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dtos';
import { UsersService } from './users.service';
import {UpdateUserDto} from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { Auth } from 'typeorm';
import { CurrentUser } from './decorators/currentUser.decorate';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './user.entity';
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService:UsersService,
      private authService:AuthService
    ){}
    @Post('/signout')
    signOut(@Session() session:any){
      session.userId = null;
    }
    // @Get('/whoami')
    // whoAmI(@Session() session:any)
    // {
    //   return this.usersService.findOne(session.userId);
    // }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user:User){
      return user;

    }
    @Post('/signup')
    async createUser(@Body() body:CreateUserDto, @Session() session:any) {
     const user = await this.authService.signup(body.email,body.password);
     session.userId = user.id;
     return user;
    }
    @Post('/signin')
    async signin(@Body() body:CreateUserDto, @Session() session:any){
      const user = await this.authService.signin(body.email,body.password);
          session.userId = user.id;
     return user;
    }
    
    @Get('/:id')    
    findUser(@Param('id') id:string){
          console.log("Handler is running")
          return this.usersService.findOne(parseInt(id));

        }
    @Get()
    findAllUser(@Query('email') email:string){
      return this.usersService.find(email);
    }
    @Delete('/:id')
    removeUser(@Param('id') id:string){
      return this.usersService.remove(parseInt(id));

    }
    @Patch('/:id')
    updateUser(@Param('id') id:string, @Body()body:UpdateUserDto){
        return this.usersService.update(parseInt(id),body);
    }
}

