import { Module } from '@nestjs/common';
import { IrrfController } from './irrf.controller';
import { IrrfService } from './irrf.service';

@Module({
  controllers: [IrrfController],
  providers: [IrrfService]
})
export class IrrfModule {}
