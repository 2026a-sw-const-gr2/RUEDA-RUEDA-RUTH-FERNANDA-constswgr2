import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expectedApiKey = process.env.FIS_EPN_API_KEY;
    const providedApiKey = request.header('X-FIS-EPN-KEY');

    if (!expectedApiKey || !providedApiKey || providedApiKey !== expectedApiKey) {
      throw new UnauthorizedException('API Key invalida o ausente');
    }

    return true;
  }
}
