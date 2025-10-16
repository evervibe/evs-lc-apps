import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('sync')
@Controller('api/sync')
export class SyncController {
  
  @Get('status')
  @ApiOperation({ summary: 'Get sync status for all workers' })
  @ApiResponse({ status: 200, description: 'Sync status retrieved successfully' })
  async getSyncStatus() {
    return {
      character: {
        lastSyncAt: new Date().toISOString(),
        status: 'success',
        recordsProcessed: 0,
        nextSyncIn: 300,
      },
      inventory: {
        lastSyncAt: new Date().toISOString(),
        status: 'success',
        recordsProcessed: 0,
        nextSyncIn: 600,
      },
      guild: {
        lastSyncAt: new Date().toISOString(),
        status: 'success',
        recordsProcessed: 0,
        nextSyncIn: 900,
      },
    };
  }

  @Post(':type')
  @ApiOperation({ summary: 'Manually trigger a sync job' })
  @ApiResponse({ status: 200, description: 'Sync job queued successfully' })
  async triggerSync(@Param('type') type: string) {
    return {
      message: 'Sync job queued successfully',
      jobId: `job-${Date.now()}`,
      type,
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: '1.1.0',
    };
  }
}
