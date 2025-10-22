import { defineStore } from 'pinia';
import { pb } from 'src/boot/pocketbase';
import type { Category, UppdragType } from 'src/models/Uppdrag';

interface City {
  id: string;
  name: string;
  countyId: string;
  label: string;
  value: string;
}

interface County {
  id: string;
  name: string;
  label: string;
  value: string;
  color: string;
  cities?: City[];
}

interface DataState {
  categories: Category[];
  uppdragTypes: UppdragType[];
  cities: City[];
  counties: County[];
}

export const useData = defineStore('data', {
  state: (): DataState => ({
    categories: [],
    uppdragTypes: [],
    cities: [],
    counties: [],
  }),

  getters: {
    categoriesWithTypes: (state) => {
      return state.categories.map(category => ({
        ...category,
        uppdragTypes: state.uppdragTypes.filter(type => type.categoryId === category.id)
      }));
    },

    countiesWithCities: (state) => {
      return state.counties.map(county => ({
        ...county,
        cities: state.cities.filter(city => city.countyId === county.id)
      }));
    },
  },

  actions: {
    async loadCategories() {
      try {
        const records = await pb.collection('categories').getFullList();
        this.categories = records as unknown as Category[];
      } catch (error) {
        console.error('Load categories error:', error);
      }
    },

    async loadUppdragTypes() {
      try {
        const records = await pb.collection('uppdrag_types').getFullList();
        this.uppdragTypes = records as unknown as UppdragType[];
      } catch (error) {
        console.error('Load uppdrag types error:', error);
      }
    },

    async loadCities() {
      try {
        const records = await pb.collection('cities').getFullList();
        this.cities = records as unknown as City[];
      } catch (error) {
        console.error('Load cities error:', error);
      }
    },

    async loadCounties() {
      try {
        const records = await pb.collection('counties').getFullList();
        this.counties = records as unknown as County[];
      } catch (error) {
        console.error('Load counties error:', error);
      }
    },

    async loadAll() {
      await Promise.all([
        this.loadCategories(),
        this.loadUppdragTypes(),
        this.loadCities(),
        this.loadCounties(),
      ]);
    },
  },
});

