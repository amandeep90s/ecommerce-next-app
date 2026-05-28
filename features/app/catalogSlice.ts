import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CatalogSortOption = 'featured' | 'newest' | 'price-low' | 'price-high';

export interface CatalogState {
  search: string;
  /** MongoDB category id, or '' for all */
  category: string;
  sort: CatalogSortOption;
  page: number;
  priceMin: string;
  priceMax: string;
}

const initialState: CatalogState = {
  search: '',
  category: '',
  sort: 'featured',
  page: 1,
  priceMin: '',
  priceMax: '',
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<CatalogSortOption>) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPriceRange(state, action: PayloadAction<{ min: string; max: string }>) {
      state.priceMin = action.payload.min;
      state.priceMax = action.payload.max;
      state.page = 1;
    },
    resetFilters(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setSearch, setCategory, setSort, setPage, setPriceRange, resetFilters } =
  catalogSlice.actions;

export default catalogSlice.reducer;
