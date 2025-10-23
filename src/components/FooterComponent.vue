<template>
  <div class="row justify-around text-primary bg-secondary">
    <div class="col-xs-12 col-md-4 q-pa-sm self-center text-center">
      <div class="text-h6">Lag <q-avatar size="32px">
          <img src="../assets/team.svg" />
        </q-avatar> Jobb</div>
      <p class="text-caption">Hjälper Sveriges föreningar genom att låta dem hjälpa dig!</p>
    </div>
    <div class="col-xs-12 col-md-4 q-pa-sm text-center">
      <q-btn flat to="/hur-det-funkar" color="primary">Hur det funkar</q-btn><br />
      <q-btn flat to="/om-oss" color="primary">Om oss</q-btn><br />
      <q-btn flat to="/kontakta-oss" color="primary">Kontakta oss</q-btn><br />
      <q-btn flat to="/anvandarvillkor" color="primary">Användarvillkor</q-btn>
    </div>
    <div class="col-xs-12 col-md-4 q-pa-sm self-center text-center">
      <div class="text-subtitle2">Kontakt</div>
      <p class="text-caption">info@lagjobb.se</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
