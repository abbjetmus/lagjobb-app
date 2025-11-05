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
                  Filtrera efter ort och kategori för att hitta uppdrag som passar er. <b>Ni betalar ingenting för att
                    använda plattformen.</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">2</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">Visa intresse för uppdrag genom att skicka ett meddelande till
                  uppdragsgivaren.
                  De får en notifikation och kan godkänna eller neka er förfrågan. När ni är godkända kan ni börja
                  planera uppdraget.</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">3</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">Genomför uppdraget enligt överenskommelsen. När ni är klara markerar ni
                  uppdraget som utfört
                  och uppdragsgivaren bekräftar och betalar. Ni kan lämna omdöme om varandra efteråt.</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">4</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">Pengarna går till er grupp som ni kan använda till vad ni vill.
                  <b>Plattformen är helt gratis - ni behåller allt ni tjänar.</b> Uppdragsgivaren betalar endast det
                  pris ni kommit överens om.</q-item-label>
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
                <q-item-label class="text-body1">Har du ett jobb som behöver göras? Registrera dig gratis och skapa ditt
                  uppdrag.
                  <b>Det kostar ingenting att använda plattformen - inte när du registrerar dig, inte när du skapar
                    uppdrag och ingen månadsavgift.</b></q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">2</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">Fyll i beskrivning, pris och önskat datum. Ladda upp bilder och markera
                  platsen på kartan.
                  Välj kategorier så att rätt grupper hittar ditt uppdrag. Efter granskning publiceras ditt uppdrag
                  automatiskt.</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">3</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">På din <b>Skapade Uppdrag</b> sida får du meddelanden från intresserade
                  grupper.
                  Läs deras förfrågningar och välja den grupp som passar bäst. Du kan godkänna eller neka
                  förfrågningar.</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">4</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body1">När gruppen har utfört uppdraget bekräftar du och betalar. Du kan lämna
                  omdöme om gruppen.
                  Uppdrag som inte är tilldelade eller där datumet har passerat markeras automatiskt.</q-item-label>
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
