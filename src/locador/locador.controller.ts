import { Controller, Get, Post, Body, Delete, Param, Headers, Patch, Query } from '@nestjs/common';
import { LocadorService } from './locador.service';

@Controller('locador')
export class LocadorController {
    constructor(private readonly locadorService: LocadorService) { }

    @Post()
    create(
        @Body() createLocadorDto: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.locadorService.createLocadores(createLocadorDto, authHeader);
    }

    // 1. ROTA ESTÁTICA LÁ NO TOPO
    @Get('health')
    healthCheck() {
        return this.locadorService.healthCheck();
    }

    // 2. UNIFICAMOS O FIND ALL E O FIND ACTIVE
    @Get()
    findAll(
        @Query() filtros: any,
        @Headers('authorization') authHeader: string
    ) {
        // Se houver "?status=ATIVO", enviamos os filtros.
        // O Service vai repassar via Axios perfeitamente.
        return this.locadorService.findActive(filtros, authHeader);
    }

    // 3. ROTAS DINÂMICAS (:id) SEMPRE NO FINAL
    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string) {
        return this.locadorService.findOne(+id, authHeader);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateLocadorDto: any,
        @Headers('authorization') authHeader: string) {
        return this.locadorService.update(+id, updateLocadorDto, authHeader);
    }

    // 4. ROTA DE REATIVAR ARRUMADA PARA NÃO DAR CONFLITO COM O UPDATE
    @Patch(':id/reativar')
    reactivate(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string) {
        return this.locadorService.reactivate(+id, authHeader);
    }

    @Delete(':id')
    remove(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string) {
        return this.locadorService.remove(+id, authHeader);
    }
}