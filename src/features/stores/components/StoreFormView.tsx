'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/shared/components/layout/AppShell';
import { Button } from '@/shared/components/ui/Button';
import { useStores } from '../hooks/useStores';
import { useStoreForm } from '../hooks/useStoreForm';
import { useAppSelector } from '@/store/hooks';
import { selectCategories } from '@/features/products/store/products.selectors';
import type { StoreFormData } from '@/shared/types';
import styles from './StoreFormView.module.css';

interface StoreFormViewProps {
  mode: 'create';
  initialData?: Partial<StoreFormData>;
}

export function StoreFormView({ mode, initialData }: StoreFormViewProps) {
  const router = useRouter();
  const { onCreate } = useStores();
  const categories = useAppSelector(selectCategories);
  const { formData, errors, isDirty, onChange, validate, reset } = useStoreForm(initialData);

  const handleSubmit = () => {
    if (!validate()) return;
    onCreate(formData);
    router.push('/stores');
  };

  return (
    <AppShell title={mode === 'create' ? 'New Store' : 'Edit Store'}>
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Store Name <span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              type="text"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="e.g. Downtown Flagship"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className={styles.errorMessage} role="alert">{errors.name}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="location" className={styles.label}>
              Location <span className={styles.required}>*</span>
            </label>
            <input
              id="location"
              className={`${styles.input} ${errors.location ? styles.inputError : ''}`}
              type="text"
              value={formData.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="e.g. New York, NY"
              aria-invalid={!!errors.location}
            />
            {errors.location && (
              <p className={styles.errorMessage} role="alert">{errors.location}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="manager" className={styles.label}>
              Manager <span className={styles.required}>*</span>
            </label>
            <input
              id="manager"
              className={`${styles.input} ${errors.manager ? styles.inputError : ''}`}
              type="text"
              value={formData.manager}
              onChange={(e) => onChange('manager', e.target.value)}
              placeholder="e.g. Alice Johnson"
              aria-invalid={!!errors.manager}
            />
            {errors.manager && (
              <p className={styles.errorMessage} role="alert">{errors.manager}</p>
            )}
          </div>

          <div className={styles.field}>
            <fieldset>
              <legend className={styles.label}>
                Status <span className={styles.required}>*</span>
              </legend>
              <div className={styles.radioGroup}>
                {(['active', 'inactive'] as const).map((status) => (
                  <label key={status} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={() => onChange('status', status)}
                      className={styles.radio}
                    />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className={styles.field}>
            <p className={styles.label}>
              Assigned Categories <span className={styles.required}>*</span>
            </p>
            {categories.length > 0 ? (
              <div className={styles.categoriesGrid}>
                {categories.map((cat) => {
                  const isChecked = formData.assignedCategories.includes(cat);
                  return (
                    <label key={cat} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const next = isChecked
                            ? formData.assignedCategories.filter((c) => c !== cat)
                            : [...formData.assignedCategories, cat];
                          onChange('assignedCategories', next);
                        }}
                        className={styles.checkbox}
                      />
                      {cat}
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className={styles.noCategoriesHint}>
                Categories load from the products API. Visit the Products page first, or add manually.
              </p>
            )}
            {errors.assignedCategories && (
              <p className={styles.errorMessage} role="alert">{errors.assignedCategories}</p>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/stores">
            <Button variant="secondary" onClick={reset}>Cancel</Button>
          </Link>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isDirty}
          >
            {mode === 'create' ? 'Create Store' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
