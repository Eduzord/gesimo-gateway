import { Controller, Get, Post, Body, Delete, Param, Headers, Query } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';

@Controller('agendamentos') // A rota pública no Gateway fica em português
export class AgendamentosController {
    constructor(private readonly agendamentosService: AgendamentosService) {}

    // -----------------------------
    // CRIAR AGENDAMENTO
    // -----------------------------
    @Post()
    create(
        @Body() createAgendamentoDto: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.agendamentosService.create(createAgendamentoDto, authHeader);
    }

    // -----------------------------
    // LISTAR HORÁRIOS DISPONÍVEIS (Rota Estática)
    // -----------------------------
    @Get('available-slots')
    availableSlots(
        @Query() filtros: any,
        @Headers('authorization') authHeader: string
    ) {
        return this.agendamentosService.availableSlots(filtros, authHeader);
    }

    // -----------------------------
    // LISTAR TODOS DO USUÁRIO
    // -----------------------------
    @Get()
    findAll(
        @Headers('authorization') authHeader: string
    ) {
        return this.agendamentosService.findAll(authHeader);
    }

    // -----------------------------
    // CANCELAR AGENDAMENTO
    // -----------------------------
    @Delete(':id')
    cancel(
        @Param('id') id: string,
        @Headers('authorization') authHeader: string
    ) {
        return this.agendamentosService.cancel(+id, authHeader);
    }
}