import { toRefs } from '@vueuse/shared';
import { sdk } from '~/sdk';
import type { Review } from '../../../../../plentymarkets-sdk/packages/api-client';
import type { FetchProductReviews, UseProductReviews, UseProductReviewsState } from './types';

/**
 * @description Composable managing product reviews data
 * @returns {@link UseProductReturn}
 * @example
 * const { data, loading, fetchProductReviews } = useProductReviews('product-slug');
 * @param productId
 * @param itemId
 */
export const useProductReviews: UseProductReviews = (productId: string | number, itemId: number) => {
  const state = useState<UseProductReviewsState>(`useProductReviews-${productId}-${itemId}`, () => ({
    data: {} as Review,
    loading: false,
  }));

  /** Function for fetching product reviews data
   * @example
   * fetchProductReviews('product-slug');
   */
  const fetchProductReviews: FetchProductReviews = async (productId: string | number, itemId: number) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() => sdk.plentysystems.getReview({ productId, itemId }));
    useHandleError(error.value);
    state.value.data = data?.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchProductReviews,
    ...toRefs(state.value),
  };
};