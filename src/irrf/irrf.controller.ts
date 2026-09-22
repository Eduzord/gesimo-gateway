import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IrrfService } from './irrf.service';

@ApiTags('irrf')
@ApiBearerAuth()
@Controller('irrf')
export class IrrfController {
    constructor(private readonly irrfService: IrrfService) { }

    // Cadastro, edição e exclusão de tabelas são exclusivos do ADMIN. A checagem confiável fica no
    // microsserviço (@Roles('ADMIN')); aqui só se evita uma chamada de rede que seria recusada.
    private exigirAdmin(req: any) {
        if (!req?.user || req.user.role !== 'ADMIN') {
            throw new ForbiddenException('Acesso negado. Apenas ADMIN pode alterar as tabelas IRRF.');
        }
    }

    @Get('tabelas')
    @ApiOperation({ summary: 'Listar as versões da tabela IRRF' })
    findAllTabelas(@Req() req: any) {
        return this.irrfService.findAllTabelas(req.user);
    }

    // Rota literal antes de 'tabelas/:id', senão "vigente" seria tratado como ID
    @Get('tabelas/vigente')
    @ApiOperation({ summary: 'Buscar a tabela IRRF vigente (data opcional AAAA-MM-DD; padrão: hoje)' })
    findTabelaVigente(@Query('data') data: string, @Req() req: any) {
        return this.irrfService.findTabelaVigente(data, req.user);
    }

    @Get('tabelas/:id')
    @ApiOperation({ summary: 'Buscar uma versão da tabela IRRF por ID' })
    findOneTabela(@Param('id') id: string, @Req() req: any) {
        return this.irrfService.findOneTabela(+id, req.user);
    }

    @Post('tabelas')
    @ApiOperation({ summary: 'Cadastrar uma nova versão da tabela IRRF (ADMIN)' })
    createTabela(@Body() createTabelaDto: any, @Req() req: any) {
        this.exigirAdmin(req);
        return this.irrfService.createTabela(createTabelaDto, req.user);
    }

    @Patch('tabelas/:id')
    @ApiOperation({ summary: 'Atualizar uma versão da tabela IRRF (ADMIN)' })
    updateTabela(@Param('id') id: string, @Body() updateTabelaDto: any, @Req() req: any) {
        this.exigirAdmin(req);
        return this.irrfService.updateTabela(+id, updateTabelaDto, req.user);
    }

    @Delete('tabelas/:id')
    @ApiOperation({ summary: 'Excluir uma versão da tabela IRRF (ADMIN)' })
    removeTabela(@Param('id') id: string, @Req() req: any) {
        this.exigirAdmin(req);
        return this.irrfService.removeTabela(+id, req.user);
    }

    @Post('calcular')
    @ApiOperation({ summary: 'Calcular o IRRF usando a tabela vigente na data de competência' })
    calcular(@Body() calcularDto: any, @Req() req: any) {
        return this.irrfService.calcular(calcularDto, req.user);
    }
}
