import { Controller, Get, Post, Body, Delete, Param, Patch, Query, Req, UploadedFile, UseInterceptors, Res, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImoveisService } from './imoveis.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('imoveis')
@ApiBearerAuth()
@Controller('imoveis')
export class ImoveisController {
    constructor(private readonly imoveisService: ImoveisService) { }

    // --- IMÓVEIS ---
    @Post()
    @ApiOperation({ summary: 'Criar um imóvel' })
    create(@Body() createImovelDto: any, @Req() req: any) {
        return this.imoveisService.createImovel(createImovelDto, req.user);
    }
    
    @Get()
    @ApiOperation({ summary: 'Listar imóveis' })
    findAllImoveis(@Req() req: any) {
        return this.imoveisService.findAllImoveis(req.user);
    }

    // --- HEALTH ---
    @Get('health')
    @ApiOperation({ summary: 'Verificar status do microsserviço de imóveis' })
    checkHealth() {
        return this.imoveisService.checkHealth();
    }

    // Rotas literais (health, contratos, despesas, locador/:id) precisam ficar antes de @Get(':id'),
    // senão o Nest as trata como se fossem um ID.
    @Get('locador/:idLocador')
    @ApiOperation({ summary: 'Listar imóveis em que o locador é proprietário' })
    findImoveisByLocador(@Param('idLocador') idLocador: string, @Req() req: any) {
        return this.imoveisService.findImoveisByLocador(+idLocador, req.user);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar imóvel' })
    updateImovel(@Param('id') id: string, @Body() updateImovelDto: any, @Req() req: any) {
        return this.imoveisService.updateImovel(+id, updateImovelDto, req.user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover imóvel' })
    removeImovel(@Param('id') id: string, @Req() req: any) {
        return this.imoveisService.removeImovel(+id, req.user);
    }

    @Delete(':id/hard')
    @ApiOperation({ summary: 'Remover imóvel definitivamente' })
    removeHardImovel(@Param('id') id: string, @Req() req: any) {
        if (!req?.user || req.user.role !== 'ADMIN') {
            throw new UnauthorizedException('Acesso negado. Apenas ADMIN pode realizar esta ação.');
        }

        return this.imoveisService.removeHardImovel(+id, req.user);
    }

    // --- CONTRATOS ---
    @Post('contratos')
    @ApiOperation({ summary: 'Criar um contrato' })
    createContrato(@Body() createContratoDto: any, @Req() req: any) {
        return this.imoveisService.createContrato(createContratoDto, req.user);
    }

    @Get('contratos')
    @ApiOperation({ summary: 'Listar contratos (filtros opcionais: idImovel, idLocatario, idLocador)' })
    findAllContratos(
        @Query('idImovel') idImovel: string,
        @Query('idLocatario') idLocatario: string,
        @Query('idLocador') idLocador: string,
        @Req() req: any,
    ) {
        return this.imoveisService.findAllContratos({ idImovel, idLocatario, idLocador }, req.user);
    }

    @Get('contratos/:id')
    @ApiOperation({ summary: 'Buscar contrato por ID' })
    findOneContrato(@Param('id') id: string, @Req() req: any) {
        return this.imoveisService.findOneContrato(+id, req.user);
    }

    @Patch('contratos/:id/arquivo')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Fazer upload de PDF de contratos' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    uploadContratoPdf(
        @Param('id') contratoId: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any
    ) {
        return this.imoveisService.uploadContratoPdf(contratoId, file, req.user);
    }

    @Patch('contratos/:id/dados')
    @ApiOperation({ summary: 'Atualizar dados de um contrato' })
    updateContratoDados(@Param('id') id: string, @Body() atualizarContratoDto: any, @Req() req: any) {
        return this.imoveisService.updateContratoDados(+id, atualizarContratoDto, req.user);
    }

    @Patch('contratos/:id/rescisao')
    @ApiOperation({ summary: 'Rescindir um contrato' })
    rescindirContrato(@Param('id') id: string, @Req() req: any) {
        return this.imoveisService.rescindirContrato(+id, req.user);
    }

    @Delete('contratos/:id/hard')
    @ApiOperation({ summary: 'Remover contrato definitivamente' })
    removeHardContrato(@Param('id') id: string, @Req() req: any) {
        if (!req?.user || req.user.role !== 'ADMIN') {
            throw new UnauthorizedException('Acesso negado. Apenas ADMIN pode realizar esta ação.');
        }

        return this.imoveisService.removeHardContrato(+id, req.user);
    }

    @Patch('contratos/:id/reajuste')
    @ApiOperation({ summary: 'Aplicar um reajuste anual ao contrato (grava o histórico e atualiza o valorAluguel vigente)' })
    aplicarReajuste(@Param('id') id: string, @Body() aplicarReajusteDto: any, @Req() req: any) {
        return this.imoveisService.aplicarReajuste(+id, aplicarReajusteDto, req.user);
    }

    @Get('contratos/:id/reajustes')
    @ApiOperation({ summary: 'Listar o histórico de reajustes de um contrato' })
    listarReajustes(@Param('id') id: string, @Req() req: any) {
        return this.imoveisService.listarReajustes(+id, req.user);
    }


    // --- DESPESAS ---
    @Post('despesas')
    @ApiOperation({ summary: 'Lançar de despesas' })
    createDespesa(@Body() createDespesaDto: any, @Req() req: any) {
        return this.imoveisService.createDespesa(createDespesaDto, req.user);
    }

    @Get('despesas')
    @ApiOperation({ summary: 'Listar despesas' })
    findAllDespesas(@Query('idContrato') idContrato: string, @Req() req: any) {
        return this.imoveisService.findAllDespesas(idContrato, req.user);
    }

    @Get('despesas/imovel/:idImovel')
    @ApiOperation({ summary: 'Listar despesas de um imóvel (todos os contratos). ?emAberto=true filtra as em aberto' })
    findDespesasPorImovel(@Param('idImovel') idImovel: string, @Query('emAberto') emAberto: string, @Req() req: any) {
        return this.imoveisService.findDespesasPorImovel(+idImovel, emAberto, req.user);
    }

    @Patch('despesas/:id/pagamento')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Liquidar despesa e fazer upload de comprovante' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                dataPagamento: {
                    type: 'string',
                    format: 'date'
                }
            },
            required: ['file', 'dataPagamento']
        },
    })
    uploadDespesaPdf(
        @Param('id') despesaId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('dataPagamento') dataPagamento: string,
        @Req() req: any
    ) {
        return this.imoveisService.uploadDespesaPdf(despesaId, file, dataPagamento, req.user);
    }

    @Get('despesas/:id/comprovante')
    @ApiOperation({ summary: 'Baixar comprovante de despesa' })
    async downloadComprovante(@Param('id') id: string, @Res() res: Response, @Req() req: any) {
        const buffer = await this.imoveisService.downloadComprovante(+id, req.user);
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="comprovante-despesa-${id}.pdf"`,
        });
        res.send(buffer);
    }

    @Delete('despesas/:id')
    @ApiOperation({ summary: 'Deletar despesa' })
    removeDespesa(@Param('id') id: string, @Req() req: any) {
        return this.imoveisService.removeDespesa(+id, req.user);
    }

    @Delete('despesas/:id/hard')
    @ApiOperation({ summary: 'Remover despesa definitivamente' })
    removeHardDespesa(@Param('id') id: string, @Req() req: any) {
        if (!req?.user || req.user.role !== 'ADMIN') {
            throw new UnauthorizedException('Acesso negado. Apenas ADMIN pode realizar esta ação.');
        }

        return this.imoveisService.removeHardDespesa(+id, req.user);
    }

    // --- MEMÓRIA DE CÁLCULO ---
    @Get('memoria-calculo/imovel/:idImovel/preparacao')
    @ApiOperation({ summary: 'Dados para montar a tela de geração da memória de cálculo' })
    prepararMemoriaCalculo(@Param('idImovel') idImovel: string, @Query('competencia') competencia: string, @Req() req: any) {
        return this.imoveisService.prepararMemoriaCalculo(+idImovel, competencia, req.user);
    }

    @Get('memoria-calculo/imovel/:idImovel/historico')
    @ApiOperation({ summary: 'Listar as memórias de cálculo já geradas para um imóvel' })
    listarMemoriasCalculo(@Param('idImovel') idImovel: string, @Req() req: any) {
        return this.imoveisService.listarMemoriasCalculo(+idImovel, req.user);
    }

    @Post('memoria-calculo')
    @ApiOperation({ summary: 'Gerar (ou reutilizar) a memória de cálculo de um mês' })
    gerarMemoriaCalculo(@Body() dto: any, @Req() req: any) {
        return this.imoveisService.gerarMemoriaCalculo(dto, req.user);
    }

    @Get('memoria-calculo/:id')
    @ApiOperation({ summary: 'Buscar uma memória de cálculo já gerada' })
    buscarMemoriaCalculo(@Param('id') id: string, @Req() req: any) {
        return this.imoveisService.buscarMemoriaCalculo(+id, req.user);
    }

    @Get('memoria-calculo/:id/excel')
    @ApiOperation({ summary: 'Baixar a memória de cálculo em Excel (.xlsx)' })
    async baixarMemoriaCalculoExcel(@Param('id') id: string, @Res() res: Response, @Req() req: any) {
        const { buffer, nomeArquivo } = await this.imoveisService.baixarMemoriaCalculoExcel(+id, req.user);

        //Repassa o nome com acentos preservados (RFC 5987), com fallback ASCII no "filename" plain.
        const nomeArquivoAscii = nomeArquivo.normalize('NFD').replace(/[̀-ͯ]/g, '');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${nomeArquivoAscii}"; filename*=UTF-8''${encodeURIComponent(nomeArquivo)}`,
        });
        res.send(buffer);
    }

    // --- IMÓVEL POR ID (deve ser a última rota GET com um único segmento dinâmico) ---
    @Get(':id')
    @ApiOperation({ summary: 'Buscar imóvel por ID' })
    findOneImovel(@Param('id') id: string, @Req() req: any) {
        return this.imoveisService.findOneImovel(+id, req.user);
    }

}
