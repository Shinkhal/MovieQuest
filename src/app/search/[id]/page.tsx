import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Redirect old `/search/:id` URLs directly to the canonical `/movie/:id` page.
 */
export default async function DeprecatedSearchIdPage({ params }: Props) {
  const { id } = await params;
  redirect(`/movie/${id}`);
}