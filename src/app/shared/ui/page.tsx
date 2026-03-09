import { AppShell } from '@/shared/components/layout/AppShell';
import { ComponentGallery } from './ComponentRegistry';

export default function UIComponentsPage() {
  return (
    <AppShell title="UI Components">
      <ComponentGallery />
    </AppShell>
  );
}