import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vocabulary, VocabularyDocument } from 'src/domains/vocabulary/vocabulary.schema';
import { GenerateQuizDto, QuizQuestionDto, QuestionType, GenerateSentenceQuizDto, SentenceQuizQuestionDto } from './dtos/quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Vocabulary.name) private vocabModel: Model<VocabularyDocument>,
  ) {}

  
  private pickDistractors(correct: string, allItems: string[], count = 3): string[] {
    const filtered = allItems.filter(item => item !== correct);
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  async generateQuiz(dto: GenerateQuizDto): Promise<QuizQuestionDto[]> {
    const query: any = {};
    if (dto.topics?.length) query.topics = { $in: dto.topics };
    if (dto.level) query.level = dto.level;

    // Fetch more than needed for distractors
    const words = await this.vocabModel.aggregate([
      { $match: query },
      { $sample: { size: dto.numQuestions * 3 } },
    ]);

    const allDefinitions = words.flatMap(w => w.definitions);
    const allWords = words.map(w => w.word);

    const questions: QuizQuestionDto[] = [];

    const questionTypes: QuestionType[] = [
      'definition_mcq',
      'word_mcq',
      'fill_blank',
      'synonym_mcq',
      'antonym_mcq',
      'example_fill',
    ];

    for (let i = 0; i < dto.numQuestions; i++) {
      const word = words[i];
      if (!word) break;

      // Pick a random question type
      let type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

      // Make sure we can generate the question type
      if (type === 'synonym_mcq' && (!word.synonyms || word.synonyms.length === 0)) {
        type = 'definition_mcq';
      } else if (type === 'antonym_mcq' && (!word.antonyms || word.antonyms.length === 0)) {
        type = 'definition_mcq';
      } else if (type === 'example_fill' && (!word.examples || word.examples.length === 0)) {
        type = 'definition_mcq';
      }

      switch (type) {
        case 'definition_mcq': {
          const correctDef = word.definitions[0];
          const options = [correctDef, ...this.pickDistractors(correctDef, allDefinitions)];
          questions.push({
            word: word.word,
            question: `What is the meaning of "${word.word}"?`,
            type,
            options: options.sort(() => Math.random() - 0.5),
            answer: correctDef,
          });
          break;
        }
        case 'word_mcq': {
          const correctDef = word.definitions[0];
          const options = [word.word, ...this.pickDistractors(word.word, allWords)];
          questions.push({
            word: word.word,
            question: `Which word means: "${correctDef}"?`,
            type,
            options: options.sort(() => Math.random() - 0.5),
            answer: word.word,
          });
          break;
        }
        case 'fill_blank': {
          const def = word.definitions[0];
          questions.push({
            word: word.word,
            question: `Fill in the blank: ${def.replace(new RegExp(word.word, 'gi'), '_____')}`,
            type,
            answer: word.word,
          });
          break;
        }
        case 'synonym_mcq': {
          const correctSyn = word.synonyms[0];
          const options = [correctSyn, ...this.pickDistractors(correctSyn, allWords)];
          questions.push({
            word: word.word,
            question: `Choose the synonym of "${word.word}":`,
            type,
            options: options.sort(() => Math.random() - 0.5),
            answer: correctSyn,
          });
          break;
        }
        case 'antonym_mcq': {
          const correctAnt = word.antonyms[0];
          const options = [correctAnt, ...this.pickDistractors(correctAnt, allWords)];
          questions.push({
            word: word.word,
            question: `Choose the antonym of "${word.word}":`,
            type,
            options: options.sort(() => Math.random() - 0.5),
            answer: correctAnt,
          });
          break;
        }
        case 'example_fill': {
          const sentence = word.examples[0].replace(new RegExp(word.word, 'gi'), '_____');
          questions.push({
            word: word.word,
            question: `Fill in the blank in the sentence: "${sentence}"`,
            type,
            answer: word.word,
            sentence,
          });
          break;
        }
      }
    }

    return questions;
  }

   async generateSentenceQuiz(
    generateQuizDto: GenerateSentenceQuizDto,
  ): Promise<SentenceQuizQuestionDto[]> {
    const { topics = [], level, numQuestions = 5 } = generateQuizDto;

    // Build filter
    const filter: any = {};
    if (topics.length) filter.topics = { $in: topics };
    if (level) filter.level = level;

    // Find vocabulary entries with example sentences
    const vocabList = await this.vocabModel
      .find(filter)
      .where('examples').ne([]) // must have example sentences
      .limit(numQuestions)
      .exec();

    const questions: SentenceQuizQuestionDto[] = [];

    for (const vocab of vocabList) {
      const fullSentence = vocab.examples[0]; // pick first example sentence

      // Simple logic: replace one random word (not the vocab word) with blank
      const words = fullSentence.split(' ');
      let missingWordIndex = words.findIndex(
        (w) => w.toLowerCase() === vocab.word.toLowerCase(),
      );

      // If vocab word not found in sentence, replace random word instead
      if (missingWordIndex === -1) {
        // find first non-trivial word (length > 3)
        missingWordIndex = words.findIndex((w) => w.length > 3);
        if (missingWordIndex === -1) missingWordIndex = 0; // fallback
      }

      const missingWord = words[missingWordIndex];
      words[missingWordIndex] = '______';

      const maskedSentence = words.join(' ');

      questions.push({
        maskedSentence,
        missingWords: [missingWord.replace(/[.,!?]/g, '')], // clean punctuation
        fullSentence,
      });
    }

    return questions;
  }
}
