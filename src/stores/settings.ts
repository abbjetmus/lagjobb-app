import { defineStore } from 'pinia';
import { pb } from 'src/boot/pocketbase';

interface SettingsState {
  autofillName: boolean;
  autofillEmail: boolean;
  autofillPhone: boolean;
  autofillStreet: boolean;
  autofillPostalCode: boolean;
  autofillCity: boolean;
  interestMessageNotification: boolean;
  uppdragCreatedNotification: boolean;
}

export const useSettings = defineStore('settings', {
  state: (): SettingsState => ({
    autofillName: false,
    autofillEmail: false,
    autofillPhone: false,
    autofillStreet: false,
    autofillPostalCode: false,
    autofillCity: false,
    interestMessageNotification: true,
    uppdragCreatedNotification: true,
  }),

  actions: {
    async loadSettings(userId: string) {
      try {
        const settings = await pb.collection('user_settings').getFirstListItem(`userId="${userId}"`);
        Object.assign(this.$state, settings);
      } catch (error) {
        console.log('No settings found, using defaults');
      }
    },

    async saveSettings(userId: string) {
      try {
        const existingSettings = await pb.collection('user_settings').getFirstListItem(`userId="${userId}"`);
        await pb.collection('user_settings').update(existingSettings.id, this.$state);
      } catch (error) {
        await pb.collection('user_settings').create({
          userId,
          ...this.$state,
        });
      }
    },
  },
});

