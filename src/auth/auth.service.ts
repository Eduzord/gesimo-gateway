import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class AuthService {
  private targetUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.targetUrl = this.configService.get('AUTH_MICROSERVICE_URL') || 'http://localhost:3000';
  }

  // Função ajudante para tratar erros do axios
  private handleError(e: any) {
    // Adicione estes logs para inspecionar o acidente:
    console.error('\n🚨 ERRO DE COMUNICAÇÃO NO GATEWAY 🚨');
    console.error('Motivo exato:', e.message);
    console.error('Destino tentado:', e.config?.url);
    console.error('------------------------------------\n');

    return throwError(() => new HttpException(e.response?.data || 'Erro Interno', e.response?.status || 500));
  }

  async login(loginDto: any) {
    console.log(`Tentando conectar na Auth API em: ${this.targetUrl}/auth/login`)
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.targetUrl}/auth/login`, loginDto).pipe(catchError(this.handleError)),
    );
    return data;
  }

  async healthCheck() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.targetUrl}/health`).pipe(catchError(this.handleError))
      );
      return data;
    } catch (e) {
      // Se der erro, retornamos um status de falha
      return { status: 'error', message: 'Auth Microservice is down' };
    }
  }
}
