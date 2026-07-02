import { Module } from '@nestjs/common';
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
export class AppModule {}
