import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { LocadorModule } from './locador/locador.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
