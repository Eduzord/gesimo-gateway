import { Controller, Get, Post, Body, Delete, Param, Headers, Patch, Query , Req } from '@nestjs/common';
import { LocadorService } from './locador.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('locadores')
@ApiBearerAuth()
@Controller('locador')
export class LocadorController {
    constructor(private readonly locadorService: LocadorService) { }

    @Post()
    create(
        @Body() createLocadorDto: any,
        @Req() req: any
    ) {
        return this.locadorService.createLocadores(createLocadorDto, req.user);
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
        @Req() req: any
    ) {
        // Se houver "?status=ATIVO", enviamos os filtros.
        // O Service vai repassar via Axios perfeitamente.
        return this.locadorService.findActive(filtros, req.user);
    }

    // 3. ROTAS DINÂMICAS (:id) SEMPRE NO FINAL
    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Req() req: any) {
        return this.locadorService.findOne(+id, req.user);
    }

    // 4. ROTA DE REATIVAR ARRUMADA PARA NÃO DAR CONFLITO COM O UPDATE
    @Patch(':id/reativar')
    reactivate(
        @Param('id') id: string,
        @Req() req: any) {
        return this.locadorService.reactivate(+id, req.user);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateLocadorDto: any,
        @Req() req: any) {
        return this.locadorService.update(+id, updateLocadorDto, req.user);
    }


    @Delete(':id')
    remove(
        @Param('id') id: string,
        @Req() req: any) {
        return this.locadorService.remove(+id, req.user);
    }
}