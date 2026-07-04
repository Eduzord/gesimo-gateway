import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class UsuariosService {
  private targetUrl: string;

  constructor(private readonly httpService: HttpService, private configService: ConfigService) {
    const baseUrl = this.configService.get('AUTH_MICROSERVICE_URL') || 'http://localhost:3000';

    // Depois montamos a rota de usuários
    this.targetUrl = `${baseUrl}/usuarios`;
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

  // CREATE - Rota pública (não precisa de token)
  async create(createUsuarioDto: any) {
    const { data } = await firstValueFrom(
      this.httpService.post(this.targetUrl, createUsuarioDto).pipe(catchError(this.handleError))
    );
    return data;
  }

  // FIND ALL - Rota protegida
  async findAll(user: any) {
    const { data } = await firstValueFrom(
      this.httpService.get(this.targetUrl, {
        headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email } // Repassa o token!
      }).pipe(catchError(this.handleError))
    );
    return data;
  }

  async findOne(id: number, user: any) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.targetUrl}/${id}`, {
        headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email } // Repassa o token
      }).pipe(catchError(this.handleError))
    );
    return data;
  }

  async update(id: number, updateUsuarioDto: any, user: any) {
    const { data } = await firstValueFrom(
      this.httpService.patch(`${this.targetUrl}/${id}`, updateUsuarioDto, {
        headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email } // Repassa o token
      }).pipe(catchError(this.handleError))
    );
    return data;
  }

  // DELETE - Rota protegida por Admin
  async remove(id: number, user: any) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`${this.targetUrl}/${id}`, {
        headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email }
      }).pipe(catchError(this.handleError))
    );
    return data;
  }
}
