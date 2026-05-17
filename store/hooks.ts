import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';

// Always use these typed hooks instead of plain useDispatch / useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
