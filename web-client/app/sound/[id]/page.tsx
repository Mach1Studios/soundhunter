interface SoundPageProps {
  params: {
    id: string;
  };
}

// Generate static params for static export
// This is required when using output: 'export' in Next.js
export async function generateStaticParams() {
  // For now, return an empty array since this is a placeholder page
  // In a real app, you would fetch all sound IDs from your API
  // Example:
  // const sounds = await fetch('your-api/sounds').then(res => res.json())
  // return sounds.map((sound) => ({ id: sound.id }))
  
  return [
    // Add some example IDs for demonstration
    { id: 'example-1' },
    { id: 'example-2' },
    { id: 'example-3' },
  ];
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