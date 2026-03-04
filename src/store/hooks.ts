import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '.';

/**
 * Typed dispatch hook — use this instead of raw `useDispatch`.
 * Ensures async thunks are properly typed.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed selector hook — use this instead of raw `useSelector`.
 * Gives full type inference on state shape.
 */
export const useAppSelector = useSelector.withTypes<RootState>();
