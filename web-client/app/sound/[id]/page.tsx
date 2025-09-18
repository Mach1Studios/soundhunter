interface SoundPageProps {
  params: {
    id: string;
  };
}

export default function SoundPage({ params }: SoundPageProps) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Sound Detail</h1>
        <div className="bg-white rounded-lg border border-neutral-300 p-8 text-center">
          <p className="text-neutral-600">Sound detail for ID: {params.id}</p>
          <p className="text-neutral-500 mt-2">Full functionality coming soon...</p>
        </div>
      </div>
    </div>
  )
}