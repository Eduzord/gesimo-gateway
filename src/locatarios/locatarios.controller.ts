import { Controller, Get, Post, Body, Param, Headers, Patch, Query, Delete , Req } from '@nestjs/common';
import { LocatariosService } from './locatarios.service';

@Controller('locatarios')
export class LocatariosController {
    constructor(private readonly locatariosService: LocatariosService) { }

    @Post()
    create(
        @Body() createLocatarioDto: any,
        @Req() req: any
    ) {
        return this.locatariosService.create(createLocatarioDto, req.user);
    }

    // A Rota estática do Health Check sempre no topo para não dar conflito!
    @Get('health')
    healthCheck() {
        return this.locatariosService.healthCheck();
    }

    @Get()
    findAll(
        @Query() filtros: any,
        @Req() req: any
    ) {
        return this.locatariosService.findAll(filtros, req.user);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Req() req: any
    ) {
        return this.locatariosService.findOne(+id, req.user);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateLocatarioDto: any,
        @Req() req: any
    ) {
        return this.locatariosService.update(+id, updateLocatarioDto, req.user);
    }

    // O Reativar também adicionado antes do Delete genérico
    @Patch(':id/reativar')
    reactivate(
        @Param('id') id: string,
        @Req() req: any
    ) {
        return this.locatariosService.reactivate(+id, req.user);
    }

    @Delete(':id')
    remove(
        @Param('id') id: string,
        @Req() req: any
    ) {
        return this.locatariosService.remove(+id, req.user);
    }
}