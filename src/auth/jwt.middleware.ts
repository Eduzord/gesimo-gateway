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
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.error('❌ Authorization não encontrado.');
            throw new UnauthorizedException(
                'Cabeçalho de autorização (Authorization) está ausente',
            );
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token JWT está ausente');
        }

        try {
            const secret = this.configService.get<string>('JWT_SECRET');

            if (!secret) {
                throw new Error('JWT_SECRET ausente');
            }

            const decoded = jwt.verify(token, secret);

            let userId: any;

            if (typeof decoded === 'object') {
                userId = decoded.sub || decoded.id;

                (req as any).user = {
                    ...decoded,
                    rawToken: token,
                };

            } else {
                (req as any).user = decoded;
            }

            if (userId) {
                try {
                    const authApiUrl =
                        this.configService.get<string>('AUTH_MICROSERVICE_URL') ||
                        'http://localhost:3000';


                    const { data: usuario } = await firstValueFrom(
                        this.httpService.get(
                            `${authApiUrl}/usuarios/${userId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        ),
                    );


                    if (usuario && usuario.status !== 1) {

                        throw new Error('Usuário inativo.');
                    }

                } catch (err: any) {

                    throw new UnauthorizedException(
                        'Usuário não encontrado ou inativo no sistema.',
                    );
                }
            }


            next();
        } catch (err: any) {
            console.error(err);

            if (err instanceof UnauthorizedException) {
                throw err;
            }

            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }
}
