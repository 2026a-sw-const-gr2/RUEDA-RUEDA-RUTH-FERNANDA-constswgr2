import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expectedApiKey = process.env.FIS_EPN_API_KEY;
    const providedApiKey = request.header('X-FIS-EPN-KEY');

    if (!expectedApiKey || !providedApiKey || providedApiKey !== expectedApiKey) {
      this.logWarn('API Key invalida o ausente', request.path);
      throw new UnauthorizedException('API Key invalida o ausente');
    }

    return true;
  }

  private logWarn(message: string, route: string): void {
    this.logger.warn(
      JSON.stringify({
        level: 'WARN',
        timestampISO: new Date().toISOString(),
        route,
        action: 'API_KEY_VALIDATION',
        message,
      }),
    );
  }
}
