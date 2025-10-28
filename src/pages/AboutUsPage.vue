<template>
  <q-page class="q-pa-md page-background-pattern">
    <div class="row">
      <div class="col-xs-0 col-sm-1"></div>
      <div class="col-xs-12 col-sm-10">
        <div class="text-center q-my-lg">
          <p class="text-primary text-h4">Om oss</p>
          <p class="text-grey-7 text-h5">En enkel plattform där lag, klasser och föreningar kan hitta uppdrag. <b>Helt
              gratis att använda.</b></p>
        </div>

        <div class="row q-gutter-y-lg">
          <div class="col-12 col-lg-6">
            <div class="text-h5 q-mb-md text-primary">Om Lagjobb.se</div>
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
              Skapa ett konto, publicera ditt uppdrag och få intresseanmälningar från grupper. Eller registrera din
              grupp
              och sök efter uppdrag i närheten. Allt samlat på ett ställe.
            </p>
          </div>

          <div class="col-12 col-lg-6 text-center">
            <q-img src="~assets/team.svg" alt="Lagjobb team" style="border-radius: 8px;" :ratio="1" class="q-mt-md" />
            <div class="q-mt-md text-h6 text-primary">Lag <q-avatar size="48px">
                <img src="~assets/team.svg" />
              </q-avatar> Jobb</div>
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
