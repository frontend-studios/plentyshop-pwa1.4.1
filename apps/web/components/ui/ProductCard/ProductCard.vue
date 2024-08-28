<template>
  <div
    class="product-item border border-neutral-200 rounded-md hover:shadow-lg flex flex-col"
    data-testid="product-card"
  >
    <div class="relative overflow-hidden">
      <UiBadges
        :class="['absolute', isFromWishlist ? 'mx-2' : 'm-2']"
        :product="product"
        :use-availability="isFromWishlist"
      />

      <div class="image-container">
        <SfLink
          :tag="NuxtLink"
          rel="preload"
          :to="productPath"
          :class="{ 'size-48': isFromSlider }"
          as="image"
          class="flex items-center justify-center"
        >
          <NuxtImg
            :src="imageUrl"
            :alt="imageAlt"
            :loading="lazy && !priority ? 'lazy' : 'eager'"
            :fetchpriority="priority ? 'high' : 'auto'"
            :preload="priority || false"
            :width="imageWidth"
            :height="imageHeight"
            class="object-contain rounded-md aspect-square w-full"
            data-testid="image-slot"
          />

          <img
            class="img-hover object-contain rounded-md aspect-square w-full"
            v-if="product.images.all[1]?.urlMiddle"
            :src="product.images.all[1].urlMiddle"
            :alt="imageAlt"
            :loading="lazy && !priority ? 'lazy' : 'eager'"
            :fetchpriority="priority ? 'high' : 'auto'"
            :preload="priority || false"
            :width="imageWidth"
            :height="imageHeight"
          />
        </SfLink>
      </div>
      <div class="fs-button absolute bottom-0 w-full mb-2 fs-button flex justify-center">
        <UiButton
          v-if="productGetters.canBeAddedToCartFromCategoryPage(product)"
          size="sm"
          class="text-white shadow hover:shadow-md active:shadow bg-primary-500 hover:bg-primary-600 active:bg-primary-700 disabled:bg-disabled-300 p-1 rounded"
          :noClass="true"
          data-testid="add-to-basket-short"
          @click="addWithLoader(Number(productGetters.getId(product)))"
          :disabled="loading"
        >
          <template #prefix v-if="!loading">
            <SfIconShoppingCart size="sm" />
          </template>
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
          <span v-else>
            {{ t('addToCartShort') }}
          </span>
        </UiButton>
        <UiButton v-else type="button" :tag="NuxtLink" :to="productPath" size="sm" class="w-fit mx-auto">
          <span>{{ t('showOptions') }}</span>
        </UiButton>
      </div>
      <div
        v-if="oldPrice && oldPrice !== mainPrice"
        class="absolute left-0 top-0 text-xs text-white bg-red-700 ml-1 mt-1 p-1 rounded"
      >
        <span> - {{ savingsPercentage }}% </span>
      </div>
      <slot name="wishlistButton">
        <WishlistButton class="absolute fs-wishlist top-1 right-1 mt-1 mr-1" :product="product" />
      </slot>
    </div>
    <div class="p-2 border-t border-neutral-200 typography-text-sm flex flex-col flex-auto bg-slate-50 rounded-b-md">
      <!-- Zeigt externalName an, wenn es existiert -->
      <span>
        <!-- {{ product.item.manufacturer.externalName }} -->
      </span>

      <div class="flex justify-between items-center mb-1">
        <div
          class="flex items-center"
          :class="{ 'mb-0': !productGetters.getShortDescription(product), 'opacity-1': ratingCount === 0 }"
        >
          <SfRating size="xs" :half-increment="true" :value="rating ?? 0" :max="5" />
          <SfCounter size="xs">{{ ratingCount }}</SfCounter>
        </div>
        <p
          class="text-xs availability-preview text-center tt-wrap relative"
          :class="'availability-' + product.variation.availability.id"
        >
          <SfTooltip :label="product.variation.availability.names.name" placement="top">
            <SfIconLocalShipping class="text-xs" />
          </SfTooltip>
        </p>
      </div>

      <SfLink
        :tag="NuxtLink"
        :to="productPath"
        class="no-underline text-left font-medium min-h-[40px] line-clamp-2"
        variant="secondary"
      >
        {{ name }}
      </SfLink>

      <div
        class="block py-2 font-normal typography-text-xs text-neutral-700 whitespace-pre-line break-words min-h-[48px]"
      >
        <span class="line-clamp-3 shortDescription">
          {{ productGetters.getShortDescription(product) }}
        </span>
      </div>

      <LowestPrice :product="product" />
      <div v-if="showBasePrice" class="mb-2">
        <BasePriceInLine :base-price="basePrice" :unit-content="unitContent" :unit-name="unitName" />
      </div>
      <div class="flex flex-wrap justify-between mb-3 price min-h-[20px]">
        <span class="block font-bold typography-text-sm" data-testid="product-card-vertical-price">
          <span v-if="!productGetters.canBeAddedToCartFromCategoryPage(product)" class="mr-1">
            {{ t('account.ordersAndReturns.orderDetails.priceFrom') }}
          </span>
          <span :class="{ 'text-red-700': oldPrice && oldPrice !== mainPrice }">
            {{ n(cheapestPrice ?? mainPrice, 'currency') }}</span
          >
          <span :class="{ 'text-red-700': oldPrice && oldPrice !== mainPrice }" v-if="showNetPrices"
            >{{ t('asterisk') }}
          </span>
        </span>
        <div
          v-if="oldPrice && oldPrice !== mainPrice"
          class="typography-text-sm text-neutral-500 flex flex-col items-end"
        >
          <span class="typography-text-sm text-neutral-500 line-through">{{ n(oldPrice, 'currency') }}</span>
          <!-- Ersparnis in Euro  -->
          <span> {{ t('categories.FSSaving') }} {{ n(savingsEuro, 'currency') }} </span>
          <!-- Ersparnis in Euro ENDE  -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CategoryTreeItem, productGetters } from '@plentymarkets/shop-api';
import {
  SfLink,
  SfIconShoppingCart,
  SfLoaderCircular,
  SfRating,
  SfCounter,
  SfIconLocalShipping,
} from '@storefront-ui/vue';
import type { ProductCardProps } from '~/components/ui/ProductCard/types';
import { SfTooltip } from '@storefront-ui/vue';
const localePath = useLocalePath();
const { t, n } = useI18n();
const {
  product,
  name,
  imageUrl,
  imageAlt,
  imageWidth,
  imageHeight,
  rating,
  ratingCount,
  priority,
  lazy,
  unitContent,
  unitName,
  basePrice,
  showBasePrice,
  isFromWishlist,
  isFromSlider,
} = withDefaults(defineProps<ProductCardProps>(), {
  lazy: true,
  imageAlt: '',
  isFromWishlist: false,
  isFromSlider: false,
});
interface Manufacturer {
  externalName?: string;
}

interface Item {
  manufacturer: Manufacturer;
}
const { data: categoryTree } = useCategoryTree();
const { openQuickCheckout } = useQuickCheckout();
const { addToCart } = useCart();
const { send } = useNotification();
const loading = ref(false);
const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;
const productPath = ref('');
const setProductPath = (categoriesTree: CategoryTreeItem[]) => {
  const path = productGetters.getCategoryUrlPath(product, categoriesTree);
  const productSlug = productGetters.getSlug(product) + `_${productGetters.getItemId(product)}`;
  productPath.value = localePath(`${path}/${productSlug}`);
};

setProductPath(categoryTree.value);

const addWithLoader = async (productId: number) => {
  loading.value = true;

  try {
    await addToCart({
      productId: productId,
      quantity: 1,
    });

    openQuickCheckout(product, 1);
    send({ message: t('addedToCart'), type: 'positive' });
  } finally {
    loading.value = false;
  }
};

const mainPrice = computed(() => {
  const price = productGetters.getPrice(product);
  if (!price) return 0;

  if (price.special) return price.special;
  if (price.regular) return price.regular;

  return 0;
});

const cheapestPrice = productGetters.getCheapestGraduatedPrice(product);
const oldPrice = productGetters.getRegularPrice(product);
const NuxtLink = resolveComponent('NuxtLink');

// Calculate savings in euro and percentage
const savingsEuro = computed(() => {
  if (oldPrice && oldPrice !== mainPrice.value) {
    return oldPrice - mainPrice.value;
  }
  return 0;
});

const savingsPercentage = computed(() => {
  if (oldPrice && oldPrice !== mainPrice.value) {
    return ((savingsEuro.value / oldPrice) * 100).toFixed(2);
  }
  return 0;
});

watch(
  () => categoryTree.value,
  (categoriesTree) => setProductPath(categoriesTree),
);
</script>
