import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class AgendamentosService {
    private targetUrl: string;

    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        // Fallback usando a porta 3003 para não dar conflito com os outros serviços
        const baseUrl = this.configService.get('AGENDAMENTOS_MICROSERVICE_URL') || 'http://localhost:3003';
        
        // A porta de saída do Gateway fala em português (agendamentos), 
        // mas bate na rota original do microsserviço em inglês (appointments)
        this.targetUrl = `${baseUrl}/appointments`; 
    }

    private handleError = (e: any) => {
        console.error('\n🚨 ERRO DE COMUNICAÇÃO NO GATEWAY 🚨');
        console.error('Motivo exato:', e.message);
        console.error('Destino tentado:', e.config?.url);
        console.error('------------------------------------\n');

        return throwError(() => new HttpException(e.response?.data || 'Erro Interno', e.response?.status || 500));
    };

    // -----------------------------
    // CRIAR AGENDAMENTO
    // -----------------------------
    async create(createAgendamentoDto: any, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.post(this.targetUrl, createAgendamentoDto, {
                headers: { Authorization: authHeader }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // -----------------------------
    // LISTAR TODOS DO USUÁRIO
    // -----------------------------
    async findAll(authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.get(this.targetUrl, {
                headers: { Authorization: authHeader }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // -----------------------------
    // LISTAR HORÁRIOS DISPONÍVEIS
    // -----------------------------
    async availableSlots(filtros: any, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.targetUrl}/available-slots`, {
                headers: { Authorization: authHeader },
                params: filtros // Repassa o ?date=YYYY-MM-DD
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // -----------------------------
    // CANCELAR AGENDAMENTO
    // -----------------------------
    async cancel(id: number, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.delete(`${this.targetUrl}/${id}`, {
                headers: { Authorization: authHeader }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }
}