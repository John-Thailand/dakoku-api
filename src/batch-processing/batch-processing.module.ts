import { Module } from '@nestjs/common';
import { BatchProcessingController } from './batch-processing.controller';
import { BatchProcessingService } from './providers/batch-processing.service';

@Module({
  controllers: [BatchProcessingController],
  providers: [BatchProcessingService],
})
export class BatchProcessingModule {}
