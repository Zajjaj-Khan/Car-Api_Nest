import { Test } from "@nestjs/testing";
import { AuthService } from "./users/auth.service";
import { UsersService } from "./users/users.service";


//Create a copy of auth service
it('can create an instance of Auth service', async ()=>{

    //creating a fake copy of the user service
    const fakeUsersService = {
        find:()=> Promise.resolve([]),
        create:(email:string,password:string)=> Promise.resolve({id:1,email,password}) 
    }
    const module = await Test.createTestingModule({
        providers: [
            AuthService,
            {
                provide:UsersService,
                useValue:fakeUsersService

            }
        
        
        ]
    }).compile()
    const service = module.get(AuthService);
    expect(service).toBeDefined();

})
