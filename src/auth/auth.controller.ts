import { Controller, HttpCode, HttpStatus, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: any) {
        return this.authService.login(loginDto);
    }
    @Get('health')
    healthCheck() {
        return this.authService.healthCheck();
    }


}
