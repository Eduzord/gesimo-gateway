import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { LocadorModule } from './locador/locador.module';
import { ImoveisModule } from './imoveis/imoveis.module';
import { LocatariosModule } from './locatarios/locatarios.module';
import { AgendamentosModule } from './agendamentos/agendamentos.module';
import { JwtMiddleware } from './auth/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.register({ global: true }),
    AuthModule,
    UsuariosModule,
    RolesModule,
    LocadorModule,
    ImoveisModule,
    LocatariosModule,
    AgendamentosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'usuarios', method: RequestMethod.POST },
        { path: 'locador/health', method: RequestMethod.GET },
        { path: 'locatarios/health', method: RequestMethod.GET }
      )
      .forRoutes(
        'agendamentos',
        'imoveis',
        'locador',
        'locatarios',
        'roles',
        'usuarios'
      );
  }
}
