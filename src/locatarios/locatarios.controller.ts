import { Controller, Get, Post, Body, Param, Headers, Patch, Query, Delete } from '@nestjs/common';
import { LocatariosService } from './locatarios.service';

@Controller('locatarios')
export class LocatariosController {
    constructor(private readonly locatariosService: LocatariosService) { }

    @Post()
    create(
        @Body() createLocatarioDto: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.locatariosService.create(createLocatarioDto, authHeader);
    }

    // A Rota estática do Health Check sempre no topo para não dar conflito!
    @Get('health')
    healthCheck() {
        return this.locatariosService.healthCheck();
    }

    @Get()
    findAll(
        @Query() filtros: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.locatariosService.findAll(filtros, authHeader);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string
    ) {
        return this.locatariosService.findOne(+id, authHeader);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateLocatarioDto: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.locatariosService.update(+id, updateLocatarioDto, authHeader);
    }

    // O Reativar também adicionado antes do Delete genérico
    @Patch(':id/reativar')
    reactivate(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string
    ) {
        return this.locatariosService.reactivate(+id, authHeader);
    }

    @Delete(':id')
    remove(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string
    ) {
        return this.locatariosService.remove(+id, authHeader);
    }
}