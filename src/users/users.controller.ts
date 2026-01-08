import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {

  @Get('internal')
  @UseGuards(ApiKeyGuard)
  getInternal() {
    return { message: 'Protected by API Key' };
  }
}
