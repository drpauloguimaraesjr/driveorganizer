import { DetailedResultCard } from '../DetailedResultCard'

export default function DetailedResultCardExample() {
  const mockResult = {
    id: '1',
    titulo: 'Efficacy of Metformin in Type 2 Diabetes: A Randomized Controlled Trial',
    ano: 2024,
    autores: ['Silva, J.', 'Santos, M.', 'Oliveira, P.', 'Costa, A.', 'Ferreira, L.'],
    periodico: 'Journal of Diabetes Research',
    tipo_estudo: 'RCT' as const,
    area_tema: ['Endocrinologia', 'Diabetes', 'Farmacologia'],
    doi: '10.1234/jdr.2024.12345',
    metodos: {
      populacao: 'Adultos com diabetes tipo 2, idade 40-65 anos',
      intervencoes: 'Metformina 1000mg 2x/dia',
      comparadores: 'Placebo',
      desfechos: 'Redução de HbA1c, eventos cardiovasculares',
      duracao: '12 meses',
      n: 450
    },
    resultados: {
      efeito_principal: 'Redução significativa de HbA1c em 1.2% comparado ao placebo',
      medidas_efeito: [
        'HbA1c: -1.2% (IC 95%: -1.4 a -1.0)',
        'Glicemia de jejum: -28 mg/dL (IC 95%: -32 a -24)',
        'Peso corporal: -2.1 kg (IC 95%: -2.8 a -1.4)'
      ],
      estatisticas: [
        'p < 0.001 para HbA1c',
        'NNT = 7 para controle glicêmico',
        'Taxa de resposta: 68% vs 32% (placebo)'
      ]
    },
    seguranca: {
      eventos_adversos: 'Desconforto gastrointestinal leve em 15% dos pacientes, sem eventos graves',
      limitacoes: 'Estudo unicêntrico, população predominantemente caucasiana',
      risco_sesgo: 'Baixo risco - randomização adequada, duplo-cego mantido'
    },
    conclusao_clinica: 'Metformina demonstrou eficácia significativa na redução de HbA1c em pacientes com diabetes tipo 2, com perfil de segurança favorável e eventos adversos leves.',
    resumo_teleprompter: 'Novo estudo comprova eficácia da metformina no controle glicêmico de diabéticos tipo 2, com redução de 1.2% na hemoglobina glicada e excelente perfil de segurança.',
    excerpt: 'O tratamento com metformina resultou em melhora significativa do controle glicêmico, demonstrando superioridade estatística em todos os desfechos primários e secundários avaliados.'
  }
  
  return (
    <div className="w-full max-w-4xl">
      <DetailedResultCard result={mockResult} />
    </div>
  )
}
