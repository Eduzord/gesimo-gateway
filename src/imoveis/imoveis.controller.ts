import { Controller, Get, Post, Body, Delete, Param, Headers, Patch, Query } from '@nestjs/common';
import { ImoveisService } from './imoveis.service';

@Controller('imoveis')
export class ImoveisController {
    constructor(private readonly imoveisService: ImoveisService) { }

    // Criar um imóvel
    @Post()
    create(
        @Body() createImovelDto: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.imoveisService.createImovel(createImovelDto, authHeader);
    }
    
    //Criar um contrato
    @Post('contratos')
    createContrato(
        @Body() createContratoDto: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.imoveisService.createContrato(createContratoDto, authHeader);
    }

    // Upload de PDF de contratos
    @Post('contratos/:id/upload-pdf')
    uploadContratoPdf(
        @Param('id') contratoId: string,
        @Body() pdfBuffer: Buffer,
        @Headers('authorization') authHeader: string
    ) {
        return this.imoveisService.uploadContratoPdf(contratoId, pdfBuffer, authHeader);
    }

    // Lançamento de despesas

    @Post('despesas')
    createDespesa(
        @Body() createDespesaDto: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.imoveisService.createDespesa(createDespesaDto, authHeader);
    }

    // Upload de PDF de despesas
    @Post('despesas/:id/upload-pdf')
    uploadDespesaPdf(
        @Param('id') despesaId: string,
        @Body() pdfBuffer: Buffer,
        @Headers('authorization') authHeader: string
    ) {
        return this.imoveisService.uploadDespesaPdf(despesaId, pdfBuffer, authHeader);
    }


}
