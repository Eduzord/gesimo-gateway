import { Injectable } from '@nestjs/common';
import { ImoveisService } from './imoveis/imoveis.service';
import { AgendamentosService } from './agendamentos/agendamentos.service'; // Importação do novo serviço

@Injectable()
export class AppService {
  constructor(
    // Injetamos apenas o ImoveisService, já que ele gerencia contratos também!
    private readonly imoveisService: ImoveisService,
    // Injetamos o serviço de agendamentos para a Agenda de Hoje
    private readonly agendamentosService: AgendamentosService,
    // Futuramente, você injetará os outros domínios aqui:
    // private readonly locadorService: LocadorService,
    // private readonly locatariosService: LocatariosService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async obterResumoDashboard(user: any) {
    try {
      // 1. Buscando dados do domínio de imóveis em paralelo
      const [listaImoveis, listaContratos, listaAgendamentos] = await Promise.all([
        this.imoveisService.findAllImoveis(user),
        this.imoveisService.findAllContratos(user), // Chamando contratos através do mesmo service
        this.agendamentosService.findAll(user), // Buscando todo o histórico de agendamentos
        // this.locadorService.getLocadores(user) // Para o futuro
      ]);

      const imoveis = Array.isArray(listaImoveis) ? listaImoveis : [];
      const contratos = Array.isArray(listaContratos) ? listaContratos : [];
      const agendamentos = Array.isArray(listaAgendamentos) ? listaAgendamentos : [];

      // 2. Lógica de Imóveis (Status)
      const disponiveis = imoveis.filter(i => i.status === 'DISPONIVEL').length;
      const alugados = imoveis.filter(i => i.status === 'ALUGADO').length;
      const vendidos = imoveis.filter(i => i.status === 'VENDIDO').length;

      // 3. Lógica de Vencimento de Contratos
      let venc7 = 0, venc15 = 0, venc30 = 0, venc60Mais = 0;
      const hoje = new Date();

      contratos.forEach(contrato => {
        // ATENÇÃO: Verifique qual é o nome exato da propriedade de data no seu Prisma
        // Pode ser dataVencimento, dataFim, validade, etc.
        if (!contrato.dataVencimento) return;

        const dataVenc = new Date(contrato.dataVencimento);

        // Calcula a diferença em dias
        const diferencaDias = Math.ceil((dataVenc.getTime() - hoje.getTime()) / (1000 * 3600 * 24));

        if (diferencaDias <= 7) venc7++;
        else if (diferencaDias <= 15) venc15++;
        else if (diferencaDias <= 30) venc30++;
        else venc60Mais++;
      });

      // ---------------------------------------------------------
      // NOVA LÓGICA: FILTRO DA AGENDA DE HOJE
      // ---------------------------------------------------------
      const inicioDeHoje = new Date(); // Pega a data atual
      inicioDeHoje.setHours(0, 0, 0, 0); // Zera as horas para o início do dia
      const inicioDeAmanha = new Date(inicioDeHoje);
      inicioDeAmanha.setDate(inicioDeAmanha.getDate() + 1);

      const agendaDeHoje = agendamentos
        .filter(ag => {
          if (!ag.data) return false;
          const dataAg = new Date(ag.data);
          // Retorna apenas os agendamentos que caem entre meia-noite de hoje e meia-noite de amanhã
          return dataAg >= inicioDeHoje && dataAg < inicioDeAmanha;
        })
        .map(ag => {
          const dataAg = new Date(ag.data);
          // Formata a hora para o padrão 09:00, 14:30, etc.
          const horaFormatada = dataAg.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          // Estilização condicional baseada no status/tipo do banco
          let badgeLabel = 'Reunião';
          let badgeClass = 'bg-gray-100 text-gray-700';

          if (ag.status === 'CANCELED') {
            badgeLabel = 'Cancelado';
            badgeClass = 'bg-red-100 text-red-600';
          } else if (ag.tipo && ag.tipo.toLowerCase().includes('visita')) {
            badgeLabel = 'Visita';
            badgeClass = 'bg-blue-100 text-blue-600';
          } else if (ag.tipo && ag.tipo.toLowerCase().includes('contrato')) {
            badgeLabel = 'Contrato';
            badgeClass = 'bg-green-100 text-green-600';
          }

          return {
            time: horaFormatada,
            description: ag.tipo || 'Compromisso',
            client: `Cliente ID: ${ag.id_locatario || 'N/D'}`,
            badge: badgeLabel,
            badgeClass: badgeClass
          };
        })
        // Ordena do compromisso mais cedo para o mais tarde para exibir cronologicamente
        .sort((a, b) => a.time.localeCompare(b.time));

      // 4. Retorno estruturado (O Payload final para o Front-end)
      return {
        imoveis: imoveis.length,
        locadores: 0,
        locatarios: 0,
        compromissos: agendaDeHoje.length, // O KPI superior agora reflete o número de compromissos do dia
        grafico: [
          { name: 'Disponíveis', value: disponiveis, color: '#bbf7d0' },
          { name: 'Alugados', value: alugados, color: '#bfdbfe' },
          { name: 'Vendidos', value: vendidos, color: '#fef08a' },
        ],
        contratos: [
          { label: "Vencendo em até 7 dias", value: venc7, color: "text-red-600" },
          { label: "Vencendo em até 15 dias", value: venc15, color: "text-amber-500" },
          { label: "Vencendo em até 30 dias", value: venc30, color: "text-amber-500" },
          { label: "Vencendo em mais de 60 dias", value: venc60Mais, color: "text-green-500" }
        ],
        agenda: agendaDeHoje // Envia a agenda mastigada para o frontend
      };
    } catch (error) {
      console.error('Erro no Gateway ao compilar Dashboard:', error.message);

      // Fallback para não quebrar a tela em caso de falha no microserviço
      return {
        imoveis: 0, locadores: 0, locatarios: 0, compromissos: 0,
        grafico: [
          { name: 'Disponíveis', value: 0, color: '#bbf7d0' },
          { name: 'Alugados', value: 0, color: '#bfdbfe' },
          { name: 'Vendidos', value: 0, color: '#fef08a' }
        ],
        contratos: [],
        agenda: [] // Evita tela branca adicionando a chave vazia
      };
    }
  }
}