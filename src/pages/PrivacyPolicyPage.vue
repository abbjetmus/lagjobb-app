<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-xs-12 col-md-10 col-lg-8">
        <div class="text-h4 q-mb-md">Användarvillkor och Integritetspolicy</div>

        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-sm">Användarvillkor</div>
            <p class="text-body1">
              Genom att använda Lagjobb.se accepterar du våra användarvillkor.
              Vi förbehåller oss rätten att när som helst uppdatera dessa villkor.
            </p>

            <div class="text-h6 q-mb-sm q-mt-lg">Integritetspolicy</div>
            <p class="text-body1">
              Vi värnar om din integritet och behandlar dina personuppgifter
              enligt gällande dataskyddslagstiftning (GDPR).
            </p>

            <p class="text-body1">
              Vi samlar in och behandlar endast de personuppgifter som är
              nödvändiga för att tillhandahålla våra tjänster, såsom namn,
              e-postadress och kontaktuppgifter.
            </p>

            <p class="text-body1">
              Dina uppgifter delas aldrig med tredje part utan ditt medgivande.
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
