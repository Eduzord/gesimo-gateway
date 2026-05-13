import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class RolesService {
  private targetUrl: string;

  constructor(private readonly httpService: HttpService, private configService: ConfigService) {
    this.targetUrl = `${this.configService.get('AUTH_MICROSERVICE_URL')}/roles` || 'http://localhost:3000';
  }

  // Função ajudante para tratar erros do axios
  private handleError(e: any) {
    return throwError(() => new HttpException(e.response?.data || 'Erro Interno', e.response?.status || 500));
  }

  // CREATE - Rota pública (não precisa de token)
  async create(createRoleDto: any, authHeader: string) {
    const { data } = await firstValueFrom(
      this.httpService.post(this.targetUrl, createRoleDto, {
        headers: { Authorization: authHeader } // Repassa o token!
      }).pipe(catchError(this.handleError))
    );
    return data;
  }


  async findAll(authHeader: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(this.targetUrl, {
        headers: { Authorization: authHeader } // Repassa o token!
      }).pipe(catchError(this.handleError))
    );
    return data;
  }

async findOne(id: number, authHeader: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.targetUrl}/${id}`, {
        headers: { Authorization: authHeader } // Repassa o token
      }).pipe(catchError(this.handleError))
    );
    return data;
  }

  async update(id: number, updateRoleDto: any, authHeader: string) {
    const { data } = await firstValueFrom(
      this.httpService.patch(`${this.targetUrl}/${id}`, updateRoleDto, {
        headers: { Authorization: authHeader } // Repassa o token
      }).pipe(catchError(this.handleError))
    );
    return data;
  }

  // DELETE - Rota protegida por Admin
  async remove(id: number, authHeader: string) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`${this.targetUrl}/${id}`, {
        headers: { Authorization: authHeader }
      }).pipe(catchError(this.handleError))
    );
    return data;
  }
}