import { Controller, Get, Post, Body, Delete, Param, Query, Req } from '@nestjs/common';
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
        @Req() req: any
    ) {
        return this.agendamentosService.create(createAgendamentoDto, req.user);
    }

    // -----------------------------
    // LISTAR HORÁRIOS DISPONÍVEIS (Rota Estática)
    // -----------------------------
    @Get('available-slots')
    availableSlots(
        @Query() filtros: any,
        @Req() req: any
    ) {
        return this.agendamentosService.availableSlots(filtros, req.user);
    }

    // -----------------------------
    // LISTAR TODOS DO USUÁRIO
    // -----------------------------
    @Get()
    findAll(
        @Req() req: any
    ) {
        return this.agendamentosService.findAll(req.user);
    }

    // -----------------------------
    // CANCELAR AGENDAMENTO
    // -----------------------------
    @Delete(':id')
    cancel(
        @Param('id') id: string,
        @Req() req: any
    ) {
        return this.agendamentosService.cancel(+id, req.user);
    }
}