import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import {randomBytes,scrypt as _scrypt} from 'crypto';
import {promisify} from 'util';

const scrypt = promisify(_scrypt);


@Injectable()
export class AuthService{
    constructor(private userService:UsersService){
    
    }
        async signup(email:string,password:string){
            //see if the email is in use
            const users = await this.userService.find(email);
            if(users.length){
                throw new BadRequestException('Email in use')
            }

            //Hash user Password
            //generate a salt 
            const salt = randomBytes(8).toString('hex');

            //Hash the salt and password
            const hash = (await scrypt(password,salt,32)) as Buffer;
            //Join Hashed result and the salt togheter
            const result = salt + '.' + hash.toString('hex');

            //Create New User and Save it
            const user = await this.userService.create(email,result);

            //return the user
            return user;
        }

       async  signin(email:string,password:string){
            const [user] = await this.userService.find(email);
            if(!user){
                throw new NotFoundException('user not found');
            }
            const [salt,storedHash] = user.password.split('.');
            const hash =(await scrypt(password,salt,32)) as Buffer;
            if(storedHash !== hash.toString('hex')){
                throw new NotAcceptableException('bad password');
            }
             return user;
        }
}