<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-xs-12 col-md-10 col-lg-8">
        <div class="text-h4 q-mb-md">Hur det funkar</div>

        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h5 q-mb-sm">För dig som vill få hjälp</div>
            <ol class="text-body1">
              <li class="q-mb-sm">Skapa ett konto</li>
              <li class="q-mb-sm">Publicera ditt uppdrag med beskrivning och pris</li>
              <li class="q-mb-sm">Vänta på att lag, klasser eller föreningar visar intresse</li>
              <li class="q-mb-sm">Välj den grupp som passar bäst</li>
              <li class="q-mb-sm">Få jobbet gjort och betala</li>
            </ol>
          </q-card-section>
        </q-card>

        <q-card>
          <q-card-section>
            <div class="text-h5 q-mb-sm">För lag, klasser och föreningar</div>
            <ol class="text-body1">
              <li class="q-mb-sm">Skapa ett konto och registrera er grupp</li>
              <li class="q-mb-sm">Sök bland tillgängliga uppdrag</li>
              <li class="q-mb-sm">Visa intresse för uppdrag som passar er</li>
              <li class="q-mb-sm">Utför uppdraget när ni blir valda</li>
              <li class="q-mb-sm">Få betalt och tjäna pengar till er grupp</li>
            </ol>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
  <q-footer class="bg-secondary text-primary q-pa-lg" style="border-top: 2px solid var(--q-primary)">
    <footer-component />
  </q-footer>
</template>

<script setup lang="ts">
import FooterComponent from 'src/components/FooterComponent.vue';
</script>
