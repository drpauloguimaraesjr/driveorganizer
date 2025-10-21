import { FilterPanel } from '../FilterPanel'
import { useState } from 'react'

export default function FilterPanelExample() {
  const [filters, setFilters] = useState({ ano: '', tema: '' })
  
  return (
    <div className="w-80">
      <FilterPanel 
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({ ano: '', tema: '' })}
        availableYears={['2024', '2023', '2022', '2021']}
        availableThemes={['Tecnologia', 'Saúde', 'Educação', 'Economia']}
      />
    </div>
  )
}
