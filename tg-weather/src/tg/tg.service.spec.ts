import { Test, TestingModule } from '@nestjs/testing';
import { TgService } from './tg.service';

describe('TgService', () => {
  let service: TgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TgService],
    }).compile();

    service = module.get<TgService>(TgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
