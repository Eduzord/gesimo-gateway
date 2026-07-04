import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class ImoveisService {
    private targetUrl: string;

    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        const baseUrl = this.configService.get('IMOVEIS_MICROSERVICE_URL') || 'http://localhost:3003/';

        
        this.targetUrl = `${baseUrl}/imoveis`;
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

    // Criar um imóvel no projeto
    async createImovel(createImovelDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(this.targetUrl, createImovelDto, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // Criar um contrato
    async createContrato(createContratoDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.targetUrl}/contratos`, createContratoDto, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // Upload de PDF de contratos
    async uploadContratoPdf(contratoId: string, pdfBuffer: Buffer, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.targetUrl}/contratos/${contratoId}/upload-pdf`, pdfBuffer, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email, 'Content-Type': 'application/pdf' }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // Lançamento de despesas

    async createDespesa(createDespesaDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.targetUrl}/despesas`, createDespesaDto, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async uploadDespesaPdf(despesaId: string, pdfBuffer: Buffer, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.targetUrl}/despesas/${despesaId}/upload-comprovante`, pdfBuffer, {
                headers: { Authorization: `Bearer ${user?.rawToken}`, 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email, 'Content-Type': 'application/pdf' }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

}

