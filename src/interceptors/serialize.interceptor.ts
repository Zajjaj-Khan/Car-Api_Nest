import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

export function Serialize(dto:any){
    return UseInterceptors(new SerialzeInterceptor(dto))
}


export class SerialzeInterceptor implements NestInterceptor {
    constructor(private dto:any){}
    intercept(context:ExecutionContext,handler:CallHandler):Observable<any>{
         return handler.handle().pipe(
            map((data:any)=>{
               return plainToInstance(this.dto,data,{excludeExtraneousValues:true});
            })
         ); 
    }
} 