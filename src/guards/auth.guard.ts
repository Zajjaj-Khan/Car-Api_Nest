import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

export class AuthGuard implements CanActivate {
    canActivate(context:ExecutionContext){
        const reequest = context.switchToHttp().getRequest();
        return reequest.session.userId;
    }
}