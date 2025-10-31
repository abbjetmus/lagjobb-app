<template>
  <q-page class="q-pa-md page-background-pattern">
    <div class="row justify-center">
      <div class="col-12" style="max-width: 800px;">
        <div class="text-center">
          <p class="text-primary text-h5">Kontakta oss</p>
          <p class="text-grey-7 text-h6">Har du frågor? Vi hjälper gärna till!</p>
        </div>

        <div class="q-mt-lg">
          <p class="text-body1 q-mb-md">
            Har du frågor om hur plattformen fungerar eller behöver du hjälp? Kontakta oss så svarar vi
            så snart vi kan, vanligtvis inom 24 timmar på vardagar.
          </p>
          <p class="text-body1 q-mb-md">
            Kom ihåg att plattformen är helt gratis att använda. Det kostar ingenting att registrera sig eller
            skapa uppdrag.
          </p>

          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="email" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6">E-post</q-item-label>
                <q-item-label>
                  <a href="mailto:info@lagjobb.se" class="text-primary">info@lagjobb.se</a>
                </q-item-label>
              </q-item-section>
            </q-item>

            <!-- <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="phone" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6">Telefon</q-item-label>
                <q-item-label caption>
                  <a href="tel:0701234567" class="text-primary">070-123 45 67</a>
                </q-item-label>
              </q-item-section>
            </q-item> -->

            <!-- <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="schedule" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6">Öppettider</q-item-label>
                <q-item-label caption>Måndag - Fredag: 09:00 - 17:00</q-item-label>
                <q-item-label caption>Lördag - Söndag: Stängt</q-item-label>
              </q-item-section>
            </q-item> -->
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
  <q-footer :dark="$q.dark.isActive" class="bg-secondary text-primary q-pa-lg"
    style="border-top: 2px solid var(--q-primary)">
    <footer-component />
  </q-footer>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import FooterComponent from 'src/components/FooterComponent.vue';

const $q = useQuasar();
</script>
