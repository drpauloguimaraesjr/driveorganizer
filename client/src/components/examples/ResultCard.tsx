import { ResultCard } from '../ResultCard'

export default function ResultCardExample() {
  const mockResult = {
    id: '1',
    title: 'Relatório de Inovação Tecnológica 2024',
    year: '2024',
    theme: 'Tecnologia',
    excerpts: [
      'A inteligência artificial está transformando setores industriais com automação avançada',
      'Investimentos em cloud computing cresceram 45% no último trimestre',
      'Tecnologias emergentes como blockchain estão sendo adotadas por empresas financeiras'
    ],
    relevanceScore: 0.92
  }
  
  return (
    <div className="w-full max-w-3xl">
      <ResultCard result={mockResult} />
    </div>
  )
}
