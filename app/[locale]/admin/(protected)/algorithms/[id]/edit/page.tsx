import { notFound } from 'next/navigation';
import { AlgorithmForm } from '@/components/admin/AlgorithmForm';
import { getAdminAlgorithm } from '@/lib/data/algorithms';

export const dynamic = 'force-dynamic';

export default async function EditAlgorithmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const algorithm = await getAdminAlgorithm(id);
  if (!algorithm) notFound();
  return <AlgorithmForm algorithm={algorithm} />;
}
