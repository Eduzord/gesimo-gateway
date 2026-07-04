import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
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
        
        // Armazenamos o token original junto com o payload decodificado
        if (typeof decoded === 'object') {
            (req as any).user = { ...decoded, rawToken: token };
        } else {
            (req as any).user = decoded;
        }

        next();
    } catch (err) {
        throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
