import { Module } from '@nestjs/common';
import { LocadorController } from './locador.controller';
import { LocadorService } from './locador.service';

@Module({
  controllers: [LocadorController],
  providers: [LocadorService]
})
export class LocadorModule {}
