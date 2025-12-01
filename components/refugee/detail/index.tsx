'use client';

// Props tipe
interface RefugeeDetailProps {
  slug: string;
}

export function RefugeeDetail({ slug }: RefugeeDetailProps) {
  return (
    <div className="container mx-auto py-8 px-6">
      <h1 className="text-2xl font-bold mb-4">Detail Pengungsi: {slug}</h1>
    </div>
  );
}
