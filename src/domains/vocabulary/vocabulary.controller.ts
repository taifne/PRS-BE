import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { SearchVocabularyDto } from './dto/search-vocabulary.dto';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  create(@Body() createVocabularyDto: CreateVocabularyDto) {
    return this.vocabularyService.create(createVocabularyDto);
  }

@Get()
findAll(@Query() query: SearchVocabularyDto) {
  const topicsArr = query.topics ? query.topics.split(',') : undefined;
  return this.vocabularyService.findAll({
    search: query.search,
    topics: topicsArr,
    level: query.level,
    page: query.page,
    limit: query.limit,
  });
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabularyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVocabularyDto: UpdateVocabularyDto) {
    return this.vocabularyService.update(id, updateVocabularyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabularyService.remove(id);
  }
}
