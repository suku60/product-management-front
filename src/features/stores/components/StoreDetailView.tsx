'use client';

import { AppShell } from '@/shared/components/layout/AppShell';
import { StoreFormView } from './StoreFormView';
import { useAppSelector } from '@/store/hooks';
import { selectStoreById } from '../store/stores.selectors';
import type { RootState } from '@/store';

interface StoreDetailViewProps {
  storeId: string;
}

export function StoreDetailView({ storeId }: StoreDetailViewProps) {
  const store = useAppSelector((state: RootState) => selectStoreById(state, storeId));

  if (!store) {
    return (
      <AppShell title="Store Not Found">
        <p>Store with ID &quot;{storeId}&quot; does not exist.</p>
      </AppShell>
    );
  }

  return (
    <StoreFormView
      mode="create"
      initialData={{
        name: store.name,
        location: store.location,
        manager: store.manager,
        assignedCategories: store.assignedCategories,
        status: store.status,
      }}
    />
  );
}
