<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-xs-12 col-md-8 col-lg-6">
        <div class="text-h4 q-mb-md">Kontakta oss</div>

        <q-card>
          <q-card-section>
            <p class="text-body1">
              Har du frågor eller synpunkter? Vi hjälper gärna till!
            </p>

            <div class="q-my-md">
              <div class="text-h6 q-mb-sm">E-post</div>
              <div class="text-body1">
                <q-icon name="email" /> info@lagjobb.se
              </div>
            </div>

            <div class="q-my-md">
              <div class="text-h6 q-mb-sm">Telefon</div>
              <div class="text-body1">
                <q-icon name="phone" /> 070-123 45 67
              </div>
            </div>
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
