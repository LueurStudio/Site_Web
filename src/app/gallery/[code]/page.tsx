import GalleryClient from '../GalleryClient';

export default function GalleryPage({ params }: { params: { code: string } }) {
  return <GalleryClient initialCode={params.code} />;
}

