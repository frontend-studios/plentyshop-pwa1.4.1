<template>
  <div class="w-full mx-auto fs-homepage mt-4">
    <div class="flex max-w-screen-2xl mx-auto hero relative justify-center mt-4">
      <div class="flex relative">
        <a :href="t('homepage.heroCTALinkTo')">
          <!-- Add width and height attributes to the img tag -->
          <img
            :src="t('homepage.heroImage')"
            alt="HeroImage"
            class="h-full object-cover object-left border-4 border-primary-500 rounded"
            width="1200"
            height="444"
          />
          <div class="heroline-wrapper absolute">
            <div class="bg-white p-3 mb-3">
              <span class="text-sm font-bold block text-primary-500" v-if="t('homepage.heroSubHeadline') != ''">{{
                t('homepage.heroSubHeadline')
              }}</span>
              <span class="text-xl block text-primary-500" v-if="t('homepage.heroSubHeadline') != ''">{{
                t('homepage.heroHeadline')
              }}</span>
            </div>
            <span
              class="btn btn-primary inline-block font-medium text-base py-2 px-4 text-white bg-primary-500 shadow hover:text-primary-500 hover:bg-white"
              v-if="t('homepage.heroCTABtnText') != ''"
            >
              {{ t('homepage.heroCTABtnText') }}
            </span>
          </div>
        </a>
      </div>
    </div>

    <div class="w-full mx-auto cats mt-4 bg-primary-500">
      <div class="max-w-screen-2xl mx-auto relative w-full mb-3 py-12">
        <div class="flex flex-wrap justify-between w-full items-end">
          <div>
            <span class="text-sm block text-white">{{ t('homepage.catSubHeadline') }}</span>
            <span class="text-2xl font-bold block text-white">{{ t('homepage.catHeadline') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto relative w-full mb-3 py-5 catcontent">
      <div class="flex flex-wrap flex-col md:flex-row gap-4 justify-center">
        <div
          v-for="{ title, image, link } in categories"
          :key="title"
          role="img"
          :aria-label="title"
          :aria-labelledby="'image-' + title"
          class="relative flex-1 justify-center"
        >
          <a :href="link">
            <img class="border-4 border-primary-500 rounded" :src="image" :alt="title" width="444" height="322" />
            <div class="cat-wrapper absolute">
              <span
                class="btn btn-primary inline-block font-medium text-base py-2 px-4 text-white shadow bg-primary-500 hover:text-primary-500 hover:bg-white"
                >{{ title }}</span
              >
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Brauche Category id 486 -->
    <NuxtLazyHydrate when-visible>
      <section class="max-w-screen-2xl mx-auto relative w-full mb-3 py-5">
        <a href="" class="typography-text-lg text-primary-500 hover:underline">{{ t('homepage.catShowAll') }}</a>
        <div class="thumbs">
          <ProductRecommendedProducts cache-key="homepage" :category-id="customProductsCategoryId" />
        </div>
      </section>
    </NuxtLazyHydrate>
  </div>
  <!--  ENDE fs-Homepage -->
</template>

<script lang="ts" setup>
const viewport = useViewport();
const { t } = useI18n();
const { data: categoryTree } = useCategoryTree();
const customProductsCategoryId = ref('');
definePageMeta({ pageType: 'static' });

type Size = {
  width: string;
  height: string;
};
type Sizes = {
  lg: Size;
  md: Size;
  sm: Size;
};
type SizeKey = keyof Sizes;

const getSizeForViewport = (sizes: Sizes) => {
  const breakpoint = viewport.breakpoint.value as SizeKey;
  return sizes[breakpoint];
};

watch(
  () => categoryTree.value,
  async () => {
    const categoryId = 486; // Hier die gewünschte category.id setzen
    customProductsCategoryId.value = categoryId.toString();
  },
  { immediate: true },
);

const categories = [
  {
    title: 'Neuheiten',
    link: '#Neuheiten',
    image: 'https://picsum.photos/seed/picsum/500/360\n',
  },
  {
    title: 'Top-Seller',
    link: '#Topseller',
    image: 'https://picsum.photos/seed/picsum/500/360\n',
  },
  {
    title: 'Kategorie',
    link: '#Kategorie3',
    image: 'https://picsum.photos/seed/picsum/500/360\n',
  },
];

useHead({
  link: [
    {
      rel: 'preload',
      href: t('homepage.heroImage'),
      as: 'image',
    },
  ],
});
</script>
