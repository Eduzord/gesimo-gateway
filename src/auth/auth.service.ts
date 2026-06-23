import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private targetUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.targetUrl = this.configService.get('AUTH_MICROSERVICE_URL') || 'http://localhost:3000';
  }

  async login(loginDto: any) {
    console.log(`Tentando conectar na Auth API em: ${this.targetUrl}/auth/login`)
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.targetUrl}/auth/login`, loginDto).pipe(
        catchError((e) => {
          console.error('ERRO REAL DO AXIOS:', e.message);
          throw new HttpException(e.response?.data || 'Erro no Microsserviço', e.response?.status || 500);
        }),
      ),
    );
    return data;
  }
}