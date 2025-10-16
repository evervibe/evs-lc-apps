import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  async check() {
    return this.healthService.check();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check' })
  async ready() {
    return this.healthService.ready();
  }

  @Get('version')
  @ApiOperation({ summary: 'Get API version' })
  version() {
    return {
      version: '1.0.0',
      name: 'lc-api',
      timestamp: new Date().toISOString(),
    };
  }
}
