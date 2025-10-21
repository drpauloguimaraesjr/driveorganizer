import { EmptyState } from '../EmptyState'

export default function EmptyStateExample() {
  return (
    <div className="w-full max-w-2xl space-y-8">
      <EmptyState variant="initial" />
      <div className="border-t pt-8">
        <EmptyState variant="no-results" query="inteligência artificial" />
      </div>
    </div>
  )
}
