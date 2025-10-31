<template>
  <q-page class="q-pa-md page-background-pattern">
    <div class="row justify-center">
      <div class="col-12" style="max-width: 800px;">
        <div class="text-center">
          <p class="text-primary text-h5">Hur det funkar</p>
          <p class="text-grey-7 text-h6">En enkel plattform där du kan hitta hjälp eller hitta uppdrag. <b>Helt gratis
              att använda.</b></p>
        </div>

        <div class="q-mt-lg">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="text-h6 text-center text-primary">Uppdragssökare</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">1</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">Är ni ett <u>lag</u>, <u>klass</u>, <u>grupp</u> eller en
                  <u>förening</u>? Registrera er grupp gratis och sök efter uppdrag i närheten.
                  Ni betalar ingenting för att använda plattformen.</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">2</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">Visa intresse för uppdrag som passar er genom att skicka ett
                  meddelande
                  till uppdragsgivaren. De får en notifikation och kan välja den grupp som passar bäst.</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">3</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">Genomför uppdraget och få betalt direkt från uppdragsgivaren.
                  Pengarna går till er grupp som ni kan använda till vad ni vill. <b>Plattformen är gratis - ni
                    behåller allt ni tjänar.</b></q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="q-mt-lg">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="text-h6 text-center text-primary">Uppdragsskapare</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">1</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">Har du ett jobb som behöver göras? Registrera dig gratis och skapa
                  ditt
                  uppdrag. Det kostar ingenting att använda plattformen - inte när du registrerar dig, inte när du
                  skapar
                  uppdrag och ingen månadsavgift.</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">2</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">Fyll i beskrivning, pris och datum. Ladda upp bilder och markera
                  platsen
                  på kartan. Använd taggar så att rätt grupper hittar ditt uppdrag. <b>Allt är helt gratis - ingen
                    avgift
                    någonsin.</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">3</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">På din <b>Skapade Uppdrag</b> sida kan du läsa meddelanden från
                  intresserade grupper, välja den som passar bäst och hantera hela uppdraget på ett
                  ställe.</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">4</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">Ditt uppdrag är synligt i 30 dagar, men du kan när som helst
                  förlänga,
                  redigera eller ta bort det. När uppdraget är klart kan du lämna ett omdöme om
                  gruppen.</q-item-label>
              </q-item-section>
            </q-item>
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
