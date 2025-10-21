import { EnhancedFilterPanel } from '../EnhancedFilterPanel'
import { useState } from 'react'

export default function EnhancedFilterPanelExample() {
  const [filters, setFilters] = useState({ ano: '', tema: '', tipo_estudo: '' })
  
  return (
    <div className="w-80">
      <EnhancedFilterPanel 
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({ ano: '', tema: '', tipo_estudo: '' })}
        availableYears={['2024', '2023', '2022', '2021']}
        availableThemes={['Endocrinologia', 'Cardiologia', 'Oncologia', 'Neurologia']}
        availableStudyTypes={['RCT', 'Cohort', 'Systematic Review', 'Meta-analysis']}
      />
    </div>
  )
}
