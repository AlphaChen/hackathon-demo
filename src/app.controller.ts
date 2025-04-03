import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ConsentCheckRequest, ConsentCheckResponse } from './app.vo';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/consentCheck")
  async consentCheck(@Body() consentCheckRequest: ConsentCheckRequest): Promise<ConsentCheckResponse> {
    return await this.appService.consentCheck(consentCheckRequest);
  }
}
