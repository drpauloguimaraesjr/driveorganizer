import { SearchBar } from '../SearchBar'
import { useState } from 'react'

export default function SearchBarExample() {
  const [value, setValue] = useState('')
  
  return (
    <div className="w-full max-w-2xl">
      <SearchBar 
        value={value} 
        onChange={setValue}
        onSearch={() => console.log('Search triggered:', value)}
      />
    </div>
  )
}
