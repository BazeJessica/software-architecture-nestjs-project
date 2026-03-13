import { Body, Controller, Post } from '@nestjs/common';
import { LoggingService } from '../../../../shared/logging/domain/services/logging.service';
import { LoginDto } from '../../application/dtos/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly loggingService: LoggingService,
  ) {}

  @Post('login')
  @ApiResponse({ status: 201, description: 'Login successful, returns access token.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async login(
    @Body() input: LoginDto,
  ): Promise<{ access_token: string; user: any }> {
    this.loggingService.log('login');
    const { accessToken, user } = await this.loginUseCase.execute(input);

    return { access_token: accessToken, user };
  }
}
