import { Controller, Get, Post, Body, Delete, Param, Headers, Patch, Query , Req } from '@nestjs/common';
import { ImoveisService } from './imoveis.service';

@Controller('imoveis')
export class ImoveisController {
    constructor(private readonly imoveisService: ImoveisService) { }

    // Criar um imóvel
    @Post()
    create(
        @Body() createImovelDto: any,
        @Req() req: any
    ) {
        return this.imoveisService.createImovel(createImovelDto, req.user);
    }
    
    //Criar um contrato
    @Post('contratos')
    createContrato(
        @Body() createContratoDto: any,
        @Req() req: any
    ) {
        return this.imoveisService.createContrato(createContratoDto, req.user);
    }

    // Upload de PDF de contratos
    @Post('contratos/:id/upload-pdf')
    uploadContratoPdf(
        @Param('id') contratoId: string,
        @Body() pdfBuffer: Buffer,
        @Req() req: any
    ) {
        return this.imoveisService.uploadContratoPdf(contratoId, pdfBuffer, req.user);
    }

    // Lançamento de despesas

    @Post('despesas')
    createDespesa(
        @Body() createDespesaDto: any,
        @Req() req: any
    ) {
        return this.imoveisService.createDespesa(createDespesaDto, req.user);
    }

    // Upload de PDF de despesas
    @Post('despesas/:id/upload-pdf')
    uploadDespesaPdf(
        @Param('id') despesaId: string,
        @Body() pdfBuffer: Buffer,
        @Req() req: any
    ) {
        return this.imoveisService.uploadDespesaPdf(despesaId, pdfBuffer, req.user);
    }


}
