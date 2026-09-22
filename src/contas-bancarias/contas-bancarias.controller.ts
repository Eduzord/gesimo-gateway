import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContasBancariasService } from './contas-bancarias.service';

@ApiTags('contas-bancarias')
@ApiBearerAuth()
@Controller('contas-bancarias')
export class ContasBancariasController {
    constructor(private readonly contasBancariasService: ContasBancariasService) {}

    //Declaradas antes de ':id' para não serem interpretadas como um ID
    @Get('padrao')
    @ApiOperation({ summary: 'Buscar a conta bancária padrão' })
    buscarPadrao(@Req() req: any) {
        return this.contasBancariasService.buscarPadrao(req.user);
    }

    @Get()
    @ApiOperation({ summary: 'Listar contas bancárias cadastradas' })
    listar(@Query('status') status: string, @Req() req: any) {
        return this.contasBancariasService.listar(status, req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar uma conta bancária por ID' })
    buscarPorId(@Param('id') id: string, @Req() req: any) {
        return this.contasBancariasService.buscarPorId(+id, req.user);
    }

    @Post()
    @ApiOperation({ summary: 'Cadastrar uma conta bancária' })
    criar(@Body() dto: any, @Req() req: any) {
        return this.contasBancariasService.criar(dto, req.user);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar uma conta bancária' })
    atualizar(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
        return this.contasBancariasService.atualizar(+id, dto, req.user);
    }

    @Patch(':id/tornar-padrao')
    @ApiOperation({ summary: 'Marcar esta conta como a padrão' })
    tornarPadrao(@Param('id') id: string, @Req() req: any) {
        return this.contasBancariasService.tornarPadrao(+id, req.user);
    }

    @Patch(':id/reativar')
    @ApiOperation({ summary: 'Reativar uma conta bancária inativada' })
    reativar(@Param('id') id: string, @Req() req: any) {
        return this.contasBancariasService.reativar(+id, req.user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Inativar uma conta bancária' })
    inativar(@Param('id') id: string, @Req() req: any) {
        return this.contasBancariasService.inativar(+id, req.user);
    }

    @Delete(':id/hard')
    @ApiOperation({ summary: 'Excluir definitivamente uma conta bancária' })
    removerDefinitivo(@Param('id') id: string, @Req() req: any) {
        if (!req?.user || req.user.role !== 'ADMIN') {
            throw new UnauthorizedException('Acesso negado. Apenas ADMIN pode realizar esta ação.');
        }

        return this.contasBancariasService.removerDefinitivo(+id, req.user);
    }
}
