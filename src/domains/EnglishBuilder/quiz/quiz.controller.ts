import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { GenerateQuizDto, GenerateSentenceQuizDto, QuizQuestionDto, SentenceQuizQuestionDto } from './dtos/quiz.dto';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a quiz with dynamic question types' })
  async generateQuiz(@Body() generateQuizDto: GenerateQuizDto): Promise<QuizQuestionDto[]> {
    return this.quizService.generateQuiz(generateQuizDto);
  }
   @Post('generate-sentence-quiz')
  @ApiOperation({ summary: 'Generate sentence fill-in-the-blank quiz questions' })
  async generateSentenceQuiz(
    @Body() generateSentenceQuizDto: GenerateSentenceQuizDto,
  ): Promise<SentenceQuizQuestionDto[]> {
    return this.quizService.generateSentenceQuiz(generateSentenceQuizDto);
  }
}
