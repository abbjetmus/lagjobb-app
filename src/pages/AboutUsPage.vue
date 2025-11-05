<template>
  <q-page :class="{ 'q-pa-md': $q.screen.gt.xs }" class="page-background-pattern">
    <div class="row justify-center q-my-xl">
      <div class="col-12" style="max-width: 800px;">
        <div class="text-center">
          <p class="text-primary text-h5">Om oss</p>
          <p class="text-grey-7 text-h6">En enkel plattform där lag, klasser och föreningar kan hitta uppdrag. <b>Helt
              gratis att använda.</b></p>
        </div>

        <div class="q-mt-lg">
          <div class="text-h6 q-mb-md text-primary">Om Lagjobb.se</div>
          <p class="text-body1 q-mb-md">
            Lagjobb.se är en plattform där du kan hitta lag, klasser och föreningar som kan hjälpa dig med olika
            uppdrag.
            Samtidigt ger vi föreningar möjlighet att hitta uppdrag och tjäna pengar till sina aktiviteter.
          </p>

          <p class="text-body1 q-mb-md">
            <b>Plattformen är helt gratis att använda</b> - det kostar ingenting att registrera sig, skapa uppdrag
            eller
            söka efter uppdrag. Ingen månadsavgift, inga dolda kostnader. Du betalar endast det pris du kommit överens
            om
            med gruppen som utför uppdraget.
          </p>

          <div class="text-h6 q-mt-lg q-mb-sm text-primary">Hur det funkar</div>
          <p class="text-body1 q-mb-md">
            <b>För uppdragsskapare:</b> Skapa ett konto, publicera ditt uppdrag med beskrivning, pris och datum.
            Få intresseanmälningar från grupper, välj den som passar bäst och hantera hela processen från godkännande
            till betalning.
          </p>
          <p class="text-body1 q-mb-md">
            <b>För grupper:</b> Registrera er grupp (lag, klass, förening eller organisation), sök efter uppdrag i
            närheten
            med filter för ort och kategori. Skicka intresseanmälningar, få godkännande och utför uppdraget.
            Få betalt direkt och använd pengarna till gruppens aktiviteter.
          </p>
          <p class="text-body1 q-mb-md">
            Allt samlat på ett ställe med tydlig kommunikation, betalningshantering och omdömen.
            <b>Helt gratis att använda - alltid.</b>
          </p>
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
