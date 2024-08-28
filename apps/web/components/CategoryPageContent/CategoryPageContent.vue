<template>
  <NarrowContainer class="mb-20 px-4 md:px-0" data-testid="category-layout">
    <h1 class="my-10 font-bold typography-headline-3 md:typography-headline-2">{{ title }}</h1>

    <template v-for="categoryTreeID in categoryTree">
      <template v-if="categoryTreeID.id == productsCatalog.category.id">
        <template v-if="categoryTreeID.childCount > 0">
          <div class="nav-wrapper flex items-start">
            <template v-for="catChildren in categoryTreeID.children">
              <div class="nav-item flex justify-center h-100 bg-white flex-col mr-2 border border-neutral-200">
                <a :href="currentUrl + '/' + catChildren.details[0].nameUrl">
                  <img
                    :src="'https://fes-themes.plentymarkets-cloud01.com/documents/' + catChildren.details[0].image2Path"
                    class="max-w-full h-full mx-auto object-contain"
                  />
                  <div class="nav-text flex align-center px-2 py-1 bg-slate-50">
                    <span>{{ catChildren.details[0].name }}</span>
                  </div>
                </a>
              </div>
            </template>
          </div>
        </template>
      </template>
    </template>

    <div v-if="productsCatalog.category.details[0].imagePath">
      <img
        :src="'https://fes-themes.plentymarkets-cloud01.com/documents/' + productsCatalog.category.details[0].imagePath"
        class="max-w-full h-auto mx-auto"
      />
    </div>

    <!-- Verwenden der stripHtml Methode, um den Text ohne HTML-Tags anzuzeigen -->
    <p class="my-20">{{ stripHtml(productsCatalog.category.details[0].description) }}</p>

    <div class="md:flex gap-6" data-testid="category-page-content">
      <CategorySidebar :is-open="isOpen" @close="close">
        <NuxtLazyHydrate when-visible>
          <slot name="sidebar" />
        </NuxtLazyHydrate>
      </CategorySidebar>
      <div class="flex-1">
        <div class="flex justify-between items-center mb-6">
          <span class="font-bold font-headings md:text-lg">
            {{ $t('numberOfProducts', { count: products?.length ?? 0, total: totalProducts }) }}
          </span>
          <UiButton @click="open" variant="tertiary" class="md:hidden whitespace-nowrap">
            <template #prefix>
              <SfIconTune />
            </template>
            {{ $t('listSettings') }}
          </UiButton>
        </div>
        <section
          v-if="products"
          class="grid grid-cols-1 2xs:grid-cols-2 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-4 mb-10 md:mb-5"
          data-testid="category-grid"
        >
          <NuxtLazyHydrate when-visible v-for="(product, index) in products" :key="productGetters.getId(product)">
            <UiProductCard
              :product="product"
              :name="productGetters.getName(product) ?? ''"
              :rating-count="productGetters.getTotalReviews(product)"
              :rating="productGetters.getAverageRating(product, 'half')"
              :price="actualPrice(product)"
              :image-url="addModernImageExtension(productGetters.getCoverImage(product))"
              :image-alt="productGetters.getName(product) ?? ''"
              :image-height="productGetters.getImageHeight(product) ?? 600"
              :image-width="productGetters.getImageWidth(product) ?? 600"
              :slug="productGetters.getSlug(product) + `-${productGetters.getId(product)}`"
              :priority="index < 5"
              :base-price="productGetters.getDefaultBasePrice(product)"
              :unit-content="productGetters.getUnitContent(product)"
              :unit-name="productGetters.getUnitName(product)"
              :show-base-price="productGetters.showPricePerUnit(product)"
            />
          </NuxtLazyHydrate>
        </section>
        <LazyCategoryEmptyState v-else />
        <div class="mt-4 mb-4 typography-text-xs flex gap-1" v-if="totalProducts > 0">
          <span>{{ $t('asterisk') }}</span>
          <span v-if="showNetPrices">{{ $t('itemExclVAT') }}</span>
          <span v-else>{{ $t('itemInclVAT') }}</span>
          <span>{{ $t('excludedShipping') }}</span>
        </div>
        <UiPagination
          v-if="totalProducts > 0"
          :key="`${totalProducts}-${itemsPerPage}`"
          :current-page="getFacetsFromURL().page ?? 1"
          :total-items="totalProducts"
          :page-size="itemsPerPage"
          :max-visible-pages="maxVisiblePages"
        />
      </div>
    </div>
  </NarrowContainer>
</template>

<script setup lang="ts">
import type { Product } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';
import { SfIconTune, useDisclosure } from '@storefront-ui/vue';
import type { CategoryPageContentProps } from '~/components/CategoryPageContent/types';

const { fetchProducts, data: productsCatalog, productsPerPage, loading } = useProducts();

withDefaults(defineProps<CategoryPageContentProps>(), {
  itemsPerPage: 24,
});

const { getFacetsFromURL } = useCategoryFilter();
const { addModernImageExtension } = useModernImage();

const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;

const { isOpen, open, close } = useDisclosure();
const viewport = useViewport();

const maxVisiblePages = computed(() => (viewport.isGreaterOrEquals('lg') ? 5 : 1));

if (viewport.isLessThan('md')) close;

const actualPrice = (product: Product): number => {
  const price = productGetters.getPrice(product);
  if (!price) return 0;

  if (price.special) return price.special;
  if (price.regular) return price.regular;

  return 0;
};

const { data: categoryTree } = useCategoryTree();

// Get URL Start
import { useRoute } from 'vue-router'; // Import the useRoute hook from vue-router
const route = useRoute();
const currentUrl = computed(() => route.fullPath);
// Get URL Ende

// Methode zum Entfernen von HTML-Tags aus einem String
function stripHtml(html: string): string {
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  return ''; // Wenn `document` nicht verfügbar ist (z. B. bei SSR), geben wir einen leeren String zurück.
}
</script>
