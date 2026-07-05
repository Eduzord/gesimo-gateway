import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

@Get('dashboard/resumo')
  async getResumoDashboard(@Req() req: any) {
    return this.appService.obterResumoDashboard(req.user);
}
}
