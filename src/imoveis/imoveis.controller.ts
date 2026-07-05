import { Controller, Get, Post, Body, Delete, Param, Patch, Query, Req, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
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

    @Get(':id')
    @ApiOperation({ summary: 'Buscar imóvel por ID' })
    findOneImovel(@Param('id') id: string, @Req() req: any) {
        return this.imoveisService.findOneImovel(+id, req.user);
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

    // --- CONTRATOS ---
    @Post('contratos')
    @ApiOperation({ summary: 'Criar um contrato' })
    createContrato(@Body() createContratoDto: any, @Req() req: any) {
        return this.imoveisService.createContrato(createContratoDto, req.user);
    }

    @Get('contratos')
    @ApiOperation({ summary: 'Listar contratos' })
    findAllContratos(@Req() req: any) {
        return this.imoveisService.findAllContratos(req.user);
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


    // --- HEALTH ---
    @Get('health')
    @ApiOperation({ summary: 'Verificar status do microsserviço de imóveis' })
    checkHealth() {
        return this.imoveisService.checkHealth();
    }
}
