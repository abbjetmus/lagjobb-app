<template>
  <q-page class="q-pa-md page-background-pattern">
    <div class="row">
      <div class="col-xs-0 col-sm-1"></div>
      <div class="col-xs-12 col-sm-10">
        <div class="text-center q-my-lg">
          <p class="text-primary text-h4">Kontakta oss</p>
          <p class="text-grey-7 text-h5">Har du frågor? Vi hjälper gärna till!</p>
        </div>

        <div class="row q-gutter-lg">
          <div class="col-12 col-lg-6 text-center">
            <q-img src="~assets/apples.jpg" alt="Kontakt" style="border-radius: 8px;" :ratio="4 / 3" class="q-mt-md" />
          </div>

          <div class="col-12 col-lg-5">


            <div class="q-mt-xl">
              <p class="text-body1 q-mb-md">
                Har du frågor om hur plattformen fungerar eller behöver du hjälp? Kontakta oss så svarar vi
                så snart vi kan, vanligtvis inom 24 timmar på vardagar.
              </p>
              <p class="text-body1">
                Kom ihåg att plattformen är helt gratis att använda. Det kostar ingenting att registrera sig eller
                skapa uppdrag.
              </p>
            </div>

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
      <div class="col-xs-0 col-sm-1"></div>
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
