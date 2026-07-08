import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import * as FormDataImport from 'form-data';
const FormData = FormDataImport as any;

@Injectable()
export class ImoveisService {
    private baseUrl: string;

    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        let url = this.configService.get('IMOVEIS_MICROSERVICE_URL') || 'http://localhost:3003';
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        this.baseUrl = url;
    }

    private handleError(e: any) {
        console.error('\n🚨 ERRO DE COMUNICAÇÃO NO GATEWAY 🚨');
        console.error('Motivo exato:', e.message);
        console.error('Destino tentado:', e.config?.url);
        console.error('------------------------------------\n');

        return throwError(() => new HttpException(e.response?.data || 'Erro Interno', e.response?.status || 500));
    }

    private getHeaders(user: any, additionalHeaders: any = {}) {
        return {
            Authorization: `Bearer ${user?.rawToken}`, 
            'x-user-id': user?.sub || user?.id, 
            'x-user-role': user?.role, 
            'x-user-email': user?.email,
            ...additionalHeaders
        };
    }

    // --- IMÓVEIS ---
    async createImovel(createImovelDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.baseUrl}/imoveis`, createImovelDto, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }
    
    async findAllImoveis(user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/imoveis`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }
    
    async findOneImovel(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/imoveis/${id}`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }
    
    async updateImovel(id: number, updateImovelDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.baseUrl}/imoveis/${id}`, updateImovelDto, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }
    
    async removeImovel(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.baseUrl}/imoveis/${id}`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async removeHardImovel(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.baseUrl}/imoveis/${id}/hard`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // --- CONTRATOS ---
    async createContrato(createContratoDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.baseUrl}/contratos`, createContratoDto, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async findAllContratos(user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/contratos`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async findOneContrato(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/contratos/${id}`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async uploadContratoPdf(contratoId: string, file: Express.Multer.File, user: any) {
        const formData = new FormData();
        formData.append('file', file.buffer, { filename: file.originalname || 'contrato.pdf', contentType: file.mimetype });

        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.baseUrl}/contratos/${contratoId}/arquivo`, formData, { 
                headers: this.getHeaders(user, formData.getHeaders()) 
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async updateContratoDados(id: number, atualizarContratoDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.baseUrl}/contratos/${id}/dados`, atualizarContratoDto, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async rescindirContrato(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.baseUrl}/contratos/${id}/rescisao`, {}, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async removeHardContrato(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.baseUrl}/contratos/${id}/hard`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // --- DESPESAS ---
    async createDespesa(createDespesaDto: any, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.baseUrl}/despesas`, createDespesaDto, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async findAllDespesas(idContrato: string | undefined, user: any) {
        const url = idContrato ? `${this.baseUrl}/despesas?idContrato=${idContrato}` : `${this.baseUrl}/despesas`;
        const { data } = await firstValueFrom(
            this.httpService.get(url, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async uploadDespesaPdf(despesaId: string, file: Express.Multer.File, dataPagamentoStr: string, user: any) {
        const formData = new FormData();
        formData.append('file', file.buffer, { filename: file.originalname || 'comprovante.pdf', contentType: file.mimetype });
        if (dataPagamentoStr) {
            formData.append('dataPagamento', dataPagamentoStr);
        }

        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.baseUrl}/despesas/${despesaId}/pagamento`, formData, { 
                headers: this.getHeaders(user, formData.getHeaders()) 
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async downloadComprovante(id: number, user: any) {
        const response = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/despesas/${id}/comprovante`, { 
                headers: this.getHeaders(user),
                responseType: 'arraybuffer' // para baixar arquivo PDF/Buffer
            }).pipe(catchError(this.handleError))
        );
        return response.data;
    }

    async removeDespesa(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.baseUrl}/despesas/${id}`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    async removeHardDespesa(id: number, user: any) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.baseUrl}/despesas/${id}/hard`, { headers: this.getHeaders(user) }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // --- HEALTH ---
    async checkHealth() {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/health`).pipe(catchError(this.handleError))
        );
        return data;
    }
}
