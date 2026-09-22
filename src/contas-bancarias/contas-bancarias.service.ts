import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

//Proxy para o catálogo de contas bancárias, que vive no mesmo microsserviço dos locatários
//(LOCATARIOS_MICROSERVICE_URL), mas não é sub-recurso de nenhum locatário específico.
@Injectable()
export class ContasBancariasService {
    private targetUrl: string;

    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        const baseUrl = this.configService.get('LOCATARIOS_MICROSERVICE_URL') || 'http://localhost:3002';
        this.targetUrl = `${baseUrl}/contas-bancarias`;
    }

    private handleError = (e: any) => {
        console.error('\n🚨 ERRO DE COMUNICAÇÃO NO GATEWAY 🚨');
        console.error('Motivo exato:', e.message);
        console.error('Destino tentado:', e.config?.url);
        console.error('------------------------------------\n');

        return throwError(() => new HttpException(e.response?.data || 'Erro Interno', e.response?.status || 500));
    };

    private getHeaders(user: any) {
        return {
            Authorization: `Bearer ${user?.rawToken}`,
            'x-user-id': user?.sub || user?.id,
            'x-user-role': user?.role,
            'x-user-email': user?.email,
        };
    }

    async listar(status: string | undefined, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(this.targetUrl, { headers: this.getHeaders(user), params: status ? { status } : {} }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async buscarPadrao(user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.targetUrl}/padrao`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async buscarPorId(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.targetUrl}/${id}`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async criar(dto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(this.targetUrl, dto, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async atualizar(id: number, dto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.targetUrl}/${id}`, dto, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async tornarPadrao(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.targetUrl}/${id}/tornar-padrao`, {}, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async reativar(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.targetUrl}/${id}/reativar`, {}, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async inativar(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.targetUrl}/${id}`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async removerDefinitivo(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.targetUrl}/${id}/hard`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }
}
