import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

//Proxy das tabelas IRRF, que vivem no microsserviço de imóveis (mesma URL do módulo imoveis)
@Injectable()
export class IrrfService {
    private baseUrl: string;

    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        let url = this.configService.get('IMOVEIS_MICROSERVICE_URL') || 'http://localhost:3003';
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        this.baseUrl = `${url}/irrf`;
    }

    private handleError(e: any) {
        console.error('\n🚨 ERRO DE COMUNICAÇÃO NO GATEWAY (IRRF) 🚨');
        console.error('Motivo exato:', e.message);
        console.error('Destino tentado:', e.config?.url);
        console.error('------------------------------------\n');

        return throwError(() => new HttpException(e.response?.data || 'Erro Interno', e.response?.status || 500));
    }

    private getHeaders(user: any) {
        return {
            Authorization: `Bearer ${user?.rawToken}`,
            'x-user-id': user?.sub || user?.id,
            'x-user-role': user?.role,
            'x-user-email': user?.email,
        };
    }

    async findAllTabelas(user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/tabelas`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async findTabelaVigente(dataReferencia: string | undefined, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/tabelas/vigente`, {
                headers: this.getHeaders(user),
                params: dataReferencia ? { data: dataReferencia } : {},
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async findOneTabela(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/tabelas/${id}`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async createTabela(createTabelaDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.baseUrl}/tabelas`, createTabelaDto, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async updateTabela(id: number, updateTabelaDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.baseUrl}/tabelas/${id}`, updateTabelaDto, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async removeTabela(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.baseUrl}/tabelas/${id}`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async calcular(calcularDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.baseUrl}/calcular`, calcularDto, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }
}
