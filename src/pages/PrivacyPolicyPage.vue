<template>
  <q-page class="q-pa-md page-background-pattern">
    <div class="row justify-center">
      <div class="col-12" style="max-width: 800px;">
        <div class="text-center">
          <p class="text-primary text-h5">Användarvillkor och Integritetspolicy</p>
          <p class="text-grey-7 text-h6">Vi skyddar din integritet och dina uppgifter</p>
        </div>

        <div class="q-mt-lg">
          <div class="text-h6 q-mb-md text-primary">Användarvillkor</div>
          <p class="text-body1 q-mb-md">
            Genom att använda Lagjobb.se accepterar du våra användarvillkor.
            <b>Kom ihåg att plattformen är helt gratis att använda - ingen avgift alls.</b>
          </p>

          <div class="text-h6 q-mt-lg q-mb-sm text-primary">Användning av plattformen</div>
          <p class="text-body1 q-mb-md">
            Du är ansvarig för att all information du publicerar är korrekt. Vi förbehåller oss rätten att ta bort
            innehåll som bryter mot våra regler eller är olagligt, samt att avsluta konton som missbrukar plattformen.
          </p>

          <div class="text-h6 q-mt-lg q-mb-sm text-primary">Betalningar och uppdrag</div>
          <p class="text-body1 q-mb-md">
            Alla betalningar sker direkt mellan uppdragsgivare och grupper. Lagjobb.se är bara en plattform för att
            koppla ihop er - vi tar ingen del av betalningarna och tar inte ansvar för transaktionerna.
            Vi rekommenderar att ni dokumenterar avtal skriftligt.
          </p>
          <p class="text-body1 q-mb-md">
            Uppdragsgivare ansvarar för att betala det överenskomna priset när uppdraget är utfört och bekräftat.
            Grupper ansvarar för att utföra uppdraget enligt överenskommelsen. Båda parter kan lämna omdömen om varandra
            efter avslutat uppdrag.
          </p>

          <div class="text-h6 q-mt-lg q-mb-sm text-primary">Integritetspolicy</div>
          <p class="text-body1 q-mb-md">
            Vi följer gällande dataskyddslagstiftning (GDPR) och skyddar dina personuppgifter.
          </p>

          <p class="text-body1 q-mb-md">
            Vi samlar bara in den information som behövs för att driva plattformen: namn, e-postadress, telefonnummer
            (valfritt) och plats.
            För grupper samlar vi också in information om grupptypen, kategori och beskrivning. För uppdrag samlar vi in
            beskrivning,
            pris, datum, plats och bilder. Vi använder uppgifterna för att möjliggöra matchning mellan uppdrag och
            grupper,
            hantera intresseanmälningar, och för att kommunicera med dig om din aktivitet på plattformen.
          </p>

          <p class="text-body1 q-mb-md">
            Vi delar aldrig dina uppgifter med tredje part. Dina kontaktuppgifter (telefon och e-post) delas endast när:
          </p>
          <ul class="text-body1 q-mb-md">
            <li>Du visar intresse för ett uppdrag och uppdragsgivaren godkänner din förfrågan</li>
            <li>Du publicerar ett uppdrag och en grupp har fått sin intresseanmälning godkänd</li>
          </ul>
          <p class="text-body1 q-mb-md">
            Kontaktuppgifter delas då bara med relevanta användare så att ni kan kontakta varandra för att genomföra
            uppdraget.
          </p>

          <div class="text-h6 q-mt-lg q-mb-sm text-primary">Dina rättigheter</div>
          <p class="text-body1 q-mb-sm">
            Enligt GDPR har du alltid rätt att:
          </p>
          <ul class="text-body1 q-mb-md">
            <li>Få tillgång till alla personuppgifter vi har om dig</li>
            <li>Rätta felaktig eller föråldrad information</li>
            <li>Begära radering av dina uppgifter (rätt att bli bortglömd)</li>
            <li>Invända mot vissa typer av databehandling</li>
            <li>Få en kopia av dina data i ett strukturerat format</li>
          </ul>
          <p class="text-body1">
            För att utöva någon av dessa rättigheter, kontakta oss på <a href="mailto:info@lagjobb.se"
              class="text-primary">info@lagjobb.se</a>.
            Vi behandlar alla förfrågningar inom 30 dagar enligt lag.
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
