import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new UnauthorizedException('Cabeçalho de autorização (Authorization) está ausente');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new UnauthorizedException('Token JWT está ausente');
    }

    try {
        // Usa o secret compartilhado para validar e decodificar o token gerado pela gesimo-auth
        const secret = this.configService.get<string>('JWT_SECRET');
        if (!secret) {
            console.warn('⚠️ JWT_SECRET não está configurado no .env do Gateway! Falha na autenticação.');
            throw new Error('JWT_SECRET ausente');
        }
        
        const decoded = jwt.verify(token, secret);
        
        let userId: any;
        if (typeof decoded === 'object') {
            userId = decoded.sub || decoded.id;
            (req as any).user = { ...decoded, rawToken: token };
        } else {
            (req as any).user = decoded;
        }

        // --- VALIDAÇÃO NO BANCO DE DADOS (auth-api) ---
        if (userId) {
            try {
                // Fazer uma chamada para a API de Autenticação para checar se o usuário existe
                const authApiUrl = this.configService.get<string>('AUTH_MICROSERVICE_URL') || 'http://localhost:3000';
                
                // Opcionalmente podemos usar o próprio token na requisição
                const { data: usuario } = await firstValueFrom(
                    this.httpService.get(`${authApiUrl}/usuarios/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                );

                if (usuario && usuario.status !== 1) {
                    throw new Error('Usuário inativo no banco de dados.');
                }
            } catch (err: any) {
                const motivo = err.message || err.code || 'Servidor auth-api indisponível (caiu ou porta errada)';
                console.error(`Falha ao validar usuário no banco. ID: ${userId}. Motivo: ${motivo}`);
                
                // Se for um erro de indisponibilidade de rede (ECONNREFUSED)
                if (err.code === 'ECONNREFUSED') {
                    console.error('🚨 ALERTA CRÍTICO: O microsserviço auth-api não está rodando na porta 3000!');
                }
                
                throw new UnauthorizedException('Usuário não encontrado, inativo ou serviço de autenticação indisponível.');
            }
        }

        next();
    } catch (err: any) {
        if (err instanceof UnauthorizedException) {
            throw err;
        }
        throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
