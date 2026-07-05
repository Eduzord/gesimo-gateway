import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImoveisController } from './imoveis.controller';
import { ImoveisService } from './imoveis.service';

@Module({
  imports: [HttpModule],
  controllers: [ImoveisController],
  providers: [ImoveisService],
  exports: [ImoveisService],
})
export class ImoveisModule {}