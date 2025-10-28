<template>
  <q-page class="q-pa-md page-background-pattern">
    <div class="row">
      <div class="col-xs-0 col-sm-1"></div>
      <div class="col-xs-12 col-sm-10">
        <div class="text-center q-my-lg">
          <p class="text-primary text-h4">Hur det funkar</p>
          <p class="text-grey-7 text-h5">En enkel plattform där du kan hitta hjälp eller hitta uppdrag. <b>Helt gratis
              att använda.</b></p>
        </div>

        <div class="row q-gutter-y-lg">
          <div class="col-12 col-lg-6 text-center gt-xs-none">
            <q-img src="https://coachestrainingblog.com/becomeacoach/wp-content/uploads/2013/06/5435735_m.jpg"
              alt="uppdragssökare" style="border-radius: 8px;" :ratio="4 / 3" class="q-mt-xl" />
          </div>

          <div class="col-12 col-lg-6">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-h5 text-center text-primary">Uppdragssökare</q-item-label>
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
        </div>

        <div class="row q-gutter-y-lg q-mt-xl">
          <div class="col-12 col-lg-6">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-h5 text-center text-primary">Uppdragsskapare</q-item-label>
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

          <div class="col-12 col-lg-6 text-center gt-xs-none">
            <q-img
              src="https://www.irishtimes.com/polopoly_fs/1.4254652.1589563055!/image/image.jpg_gen/derivatives/ratio_16x9_w1200/image.jpg"
              alt="uppdrag skapare" style="border-radius: 8px;" :ratio="4 / 3" class="q-mt-xl" />
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
