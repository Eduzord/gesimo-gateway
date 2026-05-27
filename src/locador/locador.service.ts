import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class LocadorService {
    private targetUrl: string;

    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        const baseUrl = this.configService.get('LOCADORES_MICROSERVICE_URL') || 'http://localhost:3001/';

        // Depois montamos a rota de usuários
        this.targetUrl = `${baseUrl}/locadores`;
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


    async createLocadores(createLocadorDto: any, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.post(this.targetUrl, createLocadorDto, {
                headers: { Authorization: authHeader }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // FIND ALL - Rota protegida
    async findAll(authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.get(this.targetUrl, {
                headers: { Authorization: authHeader } // Repassa o token!
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async findActive(filtros: any, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.get(this.targetUrl, {
                headers: { Authorization: authHeader }, // Repassa o token!
                params: filtros
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

    async update(id: number, updateLocadorDto: any, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.targetUrl}/${id}`, updateLocadorDto, {
                headers: { Authorization: authHeader } // Repassa o token
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // DELETE
    async remove(id: number, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.targetUrl}/${id}`, {
                headers: { Authorization: authHeader }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async reactivate(id: number, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.targetUrl}/${id}/reativar`, {
                headers: { Authorization: authHeader } // Repassa o token
            }).pipe(catchError(this.handleError))
        );
        return data;

    }

    async healthCheck() {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get("http://localhost:3001/health").pipe(catchError(this.handleError))
            );
            return data;
        } catch (e) {
            // Se der erro, retornamos um status de falha
            return { status: 'error', message: 'Locadores Microservice is down' };
        }
    }





}
