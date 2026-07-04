import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class ImoveisService {
    private baseUrl: string;

    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        this.baseUrl = this.configService.get('IMOVEIS_MICROSERVICE_URL') || 'http://localhost:3003';
    }

    private handleError(e: any) {
        console.error('\n🚨 ERRO DE COMUNICAÇÃO NO GATEWAY 🚨');
        console.error('Motivo exato:', e.message);
        console.error('Destino tentado:', e.config?.url);
        console.error('------------------------------------\n');
        return throwError(() => new HttpException(e.response?.data || 'Erro Interno', e.response?.status || 500));
    }

    private getHeaders(user: any, extraHeaders = {}) {
        return { 
            Authorization: `Bearer ${user?.rawToken}`, 
            'x-user-id': user?.sub || user?.id, 
            'x-user-role': user?.role, 
            'x-user-email': user?.email,
            ...extraHeaders
        };
    }

    // DOMÍNIO: IMÓVEIS
    async getImoveis(user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/imoveis`, { headers: this.getHeaders(user) })
                .pipe(catchError(this.handleError))
        );
        return data;
    }

    async createImovel(createImovelDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.baseUrl}/imoveis`, createImovelDto, { headers: this.getHeaders(user) })
                .pipe(catchError(this.handleError))
        );
        return data;
    }

    async getCep(cep: string, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/imoveis/cep/${cep}`, { headers: this.getHeaders(user) })
                .pipe(catchError(this.handleError))
        );
        return data;
    }

    // DOMÍNIO: CONTRATOS
    async getContratos(user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/contratos`, { headers: this.getHeaders(user) })
                .pipe(catchError(this.handleError))
        );
        return data;
    }

    async createContrato(createContratoDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.baseUrl}/contratos`, createContratoDto, { headers: this.getHeaders(user) })
                .pipe(catchError(this.handleError))
        );
        return data;
    }

    async updateContratoStatus(contratoId: string, updateDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.baseUrl}/contratos/${contratoId}`, updateDto, { headers: this.getHeaders(user) })
                .pipe(catchError(this.handleError))
        );
        return data;
    }

    // DOMÍNIO: DESPESAS (FINANCEIRO)
    async getDespesas(user: any, idContrato?: string) {
        const url = idContrato ? `${this.baseUrl}/despesas?idContrato=${idContrato}` : `${this.baseUrl}/despesas`;
        const { data } = await firstValueFrom(
            this.httpService.get(url, { headers: this.getHeaders(user) })
                .pipe(catchError(this.handleError))
        );
        return data;
    }

    async createDespesa(createDespesaDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.baseUrl}/despesas`, createDespesaDto, { headers: this.getHeaders(user) })
                .pipe(catchError(this.handleError))
        );
        return data;
    }

    async liquidarDespesa(despesaId: string, formPayload: any, user: any, contentType: string) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.baseUrl}/despesas/${despesaId}/pagamento`, formPayload, {
                headers: this.getHeaders(user, { 'Content-Type': contentType })
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async deleteDespesa(despesaId: string, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.baseUrl}/despesas/${despesaId}`, { headers: this.getHeaders(user) })
                .pipe(catchError(this.handleError))
        );
        return data;
    }
}