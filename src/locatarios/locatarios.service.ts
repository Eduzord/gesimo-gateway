import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class LocatariosService {
    private baseUrl: string;
    private targetUrl: string;

    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        // Guardamos a baseUrl separada porque o /health fica na raiz, e não em /locatarios
        this.baseUrl = this.configService.get('LOCATARIOS_MICROSERVICE_URL') || 'http://localhost:3002';
        this.targetUrl = `${this.baseUrl}/locatarios`;
    }

    private handleError = (e: any) => {
        console.error('\n🚨 ERRO DE COMUNICAÇÃO NO GATEWAY 🚨');
        console.error('Motivo exato:', e.message);
        console.error('Destino tentado:', e.config?.url);
        console.error('------------------------------------\n');

        return throwError(() => new HttpException(e.response?.data || 'Erro Interno', e.response?.status || 500));
    };

    async create(createLocatarioDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(this.targetUrl, createLocatarioDto, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async findAll(filtros: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(this.targetUrl, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email },
                params: filtros 
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async findOne(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.targetUrl}/${id}`, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async update(id: number, updateLocatarioDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.targetUrl}/${id}`, updateLocatarioDto, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // -----------------------------
    // NOVAS ROTAS (SOFT DELETE E REATIVAR)
    // -----------------------------

    async remove(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.targetUrl}/${id}`, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async reactivate(id: number, user: any) {
        const { data } = await firstValueFrom(
            // No Axios, o segundo parâmetro do PATCH é o Body. 
            // Como não mandamos dados para reativar, passamos um objeto vazio {}
            this.httpService.patch(`${this.targetUrl}/${id}/reativar`, {}, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email } 
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // -----------------------------
    // NOVA ROTA (HEALTH CHECK)
    // -----------------------------

    async healthCheck() {
        try {
            const { data } = await firstValueFrom(
                // Repare que aqui usamos o baseUrl direto, pois o controller dele é '/health'
                this.httpService.get(`${this.baseUrl}/health`).pipe(catchError(this.handleError))
            );
            return data;
        } catch (e) {
            return { status: 'error', message: 'Locatários Microservice is down' };
        }
    }
}
