<template>
  <q-btn unelevated color="secondary" class="full-width" icon="image" label="Välj bilder att lägga till"
    @click="pickImage" style="height: 60px;" />
  <div v-if="images && images.length > 0" class="full-width q-mt-md">
    <div class="row q-col-gutter-md">
      <div v-for="(image, index) in imagesToShow" :key="index" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="image-card">
          <q-img :src="getImageUrl(image)" :ratio="16 / 9" spinner-color="primary" spinner-size="82px" />
          <q-btn flat dense icon="more_vert" class="menu-button">
            <q-menu style="width: 240px">
              <q-list style="min-width: 100px" bordered>
                <q-item clickable v-close-popup @click="removeImage(image)">
                  <q-item-section>Radera</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';
import { FileAction } from 'src/models/enums';
import type { Attachment } from 'src/models/attachment';

const images = defineModel('images', { required: true, type: Array<Attachment> });

const props = defineProps<{
  collectionName: string,
  collectionItemId?: string
}>();

const { collectionName, collectionItemId } = toRefs(props);

const imagesToShow = computed(() => {
  return images.value.filter(f => f.fileAction != FileAction.Delete);
});

const getImageUrl = (image: Attachment) => {
  if (image.fromServer) {
    return `${process.env.PB_URL}/api/files/${collectionName.value}/${collectionItemId.value}/${image.name}`;
  } else {
    return URL.createObjectURL(image.file);
  }
};

const removeImage = (image: Attachment) => {
  if (image.fromServer) {
    images.value = images.value.map(f => {
      if (f.name == image.name) {
        return { ...f, fileAction: FileAction.Delete };
      }
      return f;
    });
  } else {
    images.value = images.value.filter(f => f.name != image.name);
  }
};

const pickImage = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;

  input.onchange = (event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        images.value = [
          {
            file: file,
            name: file.name,
            fromServer: false,
            fileAction: FileAction.Add
          },
          ...images.value
        ];
      });
    }
  };

  input.click();
};
</script>

<style scoped>
:deep(.q-field__after) {
  padding: 0px;
  margin: 0px;
}

.image-card {
  position: relative;
}

.menu-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.7);
  /* border-radius: 50%; */
}

.menu-button:hover {
  background: rgba(255, 255, 255, 0.9);
}
</style>
