<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-xs-12 col-md-10 col-lg-8">
        <div class="text-h4 q-mb-md">Om oss</div>

        <q-card>
          <q-card-section>
            <div class="text-h5 q-mb-sm">Lagjobb.se</div>
            <p class="text-body1">
              Lagjobb.se är en plattform som hjälper Sveriges föreningar genom att
              låta dem hjälpa dig! Genom att låta ett lag, klass eller förening
              utföra ditt uppdrag bidrar du till Sveriges föreningsliv samtidigt
              som du nästan halverar kostnaderna för arbetet jämfört med om du
              skulle anlita ett företag.
            </p>

            <p class="text-body1">
              Vi tror på kraften i föreningslivet och vill göra det enkelt för både
              privatpersoner och föreningar att mötas och hjälpa varandra.
            </p>
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
