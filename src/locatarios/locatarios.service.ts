// src/locatarios/locatarios.service.ts

import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class LocatariosService {
    private targetUrl: string;

    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        // Busca a URL no .env ou usa a porta 3002 como fallback
        const baseUrl = this.configService.get('LOCATARIOS_MICROSERVICE_URL') || 'http://localhost:3002';
        this.targetUrl = `${baseUrl}/locatarios`;
    }

    // Função ajudante para tratar erros do axios
    private handleError = (e: any) => {
        console.error('\n🚨 ERRO DE COMUNICAÇÃO NO GATEWAY 🚨');
        console.error('Motivo exato:', e.message);
        console.error('Destino tentado:', e.config?.url);
        console.error('------------------------------------\n');

        return throwError(() => new HttpException(e.response?.data || 'Erro Interno', e.response?.status || 500));
    };

    // -----------------------------
    // CRIAR LOCATÁRIO (POST /locatarios)
    // -----------------------------
    async create(createLocatarioDto: any, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.post(this.targetUrl, createLocatarioDto, {
                headers: { Authorization: authHeader }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // -----------------------------
    // LISTAR COM FILTROS (GET /locatarios)
    // -----------------------------
    async findAll(filtros: any, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.get(this.targetUrl, {
                headers: { Authorization: authHeader },
                params: filtros // Repassa a paginação e filtros (page, limit, status, email)
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // -----------------------------
    // BUSCAR POR ID (GET /locatarios/:id)
    // -----------------------------
    async findOne(id: number, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.targetUrl}/${id}`, {
                headers: { Authorization: authHeader }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }

    // -----------------------------
    // ATUALIZAR LOCATÁRIO (PATCH /locatarios/:id)
    // -----------------------------
    async update(id: number, updateLocatarioDto: any, authHeader: string) {
        const { data } = await firstValueFrom(
            this.httpService.patch(`${this.targetUrl}/${id}`, updateLocatarioDto, {
                headers: { Authorization: authHeader }
            }).pipe(catchError(this.handleError))
        );
        return data;
    }
}