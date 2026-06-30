import { Controller, Get, Post, Body, Param, Headers, Patch, Query } from '@nestjs/common';
import { LocatariosService } from './locatarios.service';

@Controller('locatarios')
export class LocatariosController {
    constructor(private readonly locatariosService: LocatariosService) { }

    // -----------------------------
    // CRIAR LOCATÁRIO
    // -----------------------------
    @Post()
    create(
        @Body() createLocatarioDto: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.locatariosService.create(createLocatarioDto, authHeader);
    }

    // -----------------------------
    // LISTAR COM PAGINAÇÃO + FILTROS
    // -----------------------------
    @Get()
    findAll(
        @Query() filtros: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.locatariosService.findAll(filtros, authHeader);
    }

    // -----------------------------
    // BUSCAR POR ID
    // -----------------------------
    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string
    ) {
        return this.locatariosService.findOne(+id, authHeader);
    }

    // -----------------------------
    // ATUALIZAR LOCATÁRIO
    // -----------------------------
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateLocatarioDto: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.locatariosService.update(+id, updateLocatarioDto, authHeader);
    }
}