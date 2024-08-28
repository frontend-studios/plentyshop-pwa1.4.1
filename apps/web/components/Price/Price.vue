<template>
  <div class="text-sm py-1">
    <span class="mr-2 text-secondary-500 font-bold font-headings text-2xl" data-testid="price">
      {{ $n(price, 'currency') }}
      <span v-if="showNetPrices">{{ $t('asterisk') }} </span>
    </span>
    <span v-if="oldPrice && oldPrice !== normalPrice" class="text-base font-normal text-neutral-500 line-through">
      {{ $n(oldPrice, 'currency') }}
    </span>
    <!-- Ersparnis in Prozent und Euro anzeigen, falls oldPrice vorhanden -->
    <span v-if="oldPrice && oldPrice > price" class="text-base font-normal text-green-500 block">
      {{ t('categories.FSSaving') }} ({{ discountPercentage.toFixed(2) }}% / {{ $n(discountAmount, 'currency') }})
    </span>
  </div>
</template>

<script setup lang="ts">
import type { PriceProps } from '~/components/Price/types';

const { t, n } = useI18n();
// Props definieren
const props = defineProps<PriceProps>();

// Runtime-Konfiguration laden
const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;

// Preise aus den Props verwenden
const price = props.price;
const oldPrice = props.oldPrice;
const normalPrice = props.normalPrice;

// Ersparnis berechnen
const discountAmount = oldPrice ? oldPrice - price : 0;
const discountPercentage = oldPrice ? ((oldPrice - price) / oldPrice) * 100 : 0;
</script>
