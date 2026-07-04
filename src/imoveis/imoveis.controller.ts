import { Controller, Get, Post, Body, Delete, Param, Patch, Query, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImoveisService } from './imoveis.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';

@ApiTags('imoveis-gateway')
@ApiBearerAuth()
@Controller('imoveis') //O Gateway agrupa tudo em /imoveis para o Front-end
export class ImoveisController {
    constructor(private readonly imoveisService: ImoveisService) { }

    //IMÓVEIS
    @Get()
    @ApiOperation({ summary: 'Listar catálogo de imóveis' })
    getImoveis(@Req() req: any) {
        return this.imoveisService.getImoveis(req.user);
    }

    @Post()
    @ApiOperation({ summary: 'Cadastrar novo imóvel' })
    createImovel(@Body() createImovelDto: any, @Req() req: any) {
        return this.imoveisService.createImovel(createImovelDto, req.user);
    }

    @Get('cep/:cep')
    @ApiOperation({ summary: 'Buscar endereço por CEP (Integração ViaCEP)' })
    getCep(@Param('cep') cep: string, @Req() req: any) {
        return this.imoveisService.getCep(cep, req.user);
    }

    //CONTRATOS
    @Get('contratos')
    @ApiOperation({ summary: 'Listar contratos de locação' })
    getContratos(@Req() req: any) {
        return this.imoveisService.getContratos(req.user);
    }

    @Post('contratos')
    @ApiOperation({ summary: 'Gerar novo contrato' })
    createContrato(@Body() createContratoDto: any, @Req() req: any) {
        return this.imoveisService.createContrato(createContratoDto, req.user);
    }

    @Patch('contratos/:id')
    @ApiOperation({ summary: 'Alterar status do contrato' })
    updateContrato(@Param('id') id: string, @Body() updateDto: any, @Req() req: any) {
        return this.imoveisService.updateContratoStatus(id, updateDto, req.user);
    }

    //DESPESAS
    @Get('despesas')
    @ApiOperation({ summary: 'Listar faturas/despesas' })
    getDespesas(@Query('idContrato') idContrato: string, @Req() req: any) {
        return this.imoveisService.getDespesas(req.user, idContrato);
    }

    @Post('despesas')
    @ApiOperation({ summary: 'Lançar nova fatura manual' })
    createDespesa(@Body() createDespesaDto: any, @Req() req: any) {
        return this.imoveisService.createDespesa(createDespesaDto, req.user);
    }

    @Patch('despesas/:id/pagamento')
    @ApiOperation({ summary: 'Liquidar fatura com comprovante' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file')) //Intercepta o upload no Gateway
    liquidarDespesa(
        @Param('id') despesaId: string, 
        @Body() body: any, 
        @UploadedFile() file: any, 
        @Req() req: any
    ) {
        //Como é multipart/form-data, passo o arquivo e os campos do formulário para o serviço, que repassa para o microserviço.
        //O Axios cuidará do roteamento se passarmos o header Content-Type adequado.
        //Nota: Para repassar FormData perfeito via Axios no NestJS, usamos req.headers['content-type'].
        return this.imoveisService.liquidarDespesa(despesaId, req.body, req.user, req.headers['content-type']);
    }

    @Delete('despesas/:id')
    @ApiOperation({ summary: 'Cancelar/Excluir fatura' })
    deleteDespesa(@Param('id') despesaId: string, @Req() req: any) {
        return this.imoveisService.deleteDespesa(despesaId, req.user);
    }
}