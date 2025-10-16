import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get news articles' })
  async findAll(@Query('category') category?: string) {
    const categoryNum = category ? parseInt(category, 10) : undefined;
    return this.newsService.findAll(categoryNum);
  }
}
