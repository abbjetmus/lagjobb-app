<template>
  <div>
    <q-avatar class="relative-position bg-grey-3" text-color="white" :size="size" rounded>
      <q-img v-if="selectedImageUrl" :src="selectedImageUrl" spinner-color="primary" spinner-size="24px" ratio="1"
        fit="cover" style="height: 100%; width: 100%;" />
      <q-img v-else-if="photoUrl" :src="photoUrl" spinner-color="primary" spinner-size="24px" ratio="1"
        style="height: 100%; width: 100%;">
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-grey-3">
            <q-icon name="photo_camera" size="24px" color="grey-6" />
          </div>
        </template>
      </q-img>

      <q-icon v-else name="photo_camera" :size="iconSize" color="grey-6" />

      <q-btn v-if="selectedImageUrl || photoUrl" size="10px" round color="red" icon="clear"
        style="position: absolute; top: -12px; right: -12px; border-radius: 50% !important;" @click="removeImage" />

      <q-btn v-else size="10px" round color="primary" icon="add"
        style="position: absolute; bottom: -12px; right: -12px; border-radius: 50% !important;" @click="pickImage" />
    </q-avatar>
    <input ref="fileInputRef" type="file" accept="image/*" style="display: none" @change="onFileSelected" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  size?: string;
  photoUrl?: string | null;
}>();

const emits = defineEmits<{
  'file-selected': [file: File | null]
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedImageUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

const iconSize = computed(() => {
  const sizeValue = parseInt(props.size || '120');
  return `${sizeValue / 2.5}px`;
});

const pickImage = () => {
  fileInputRef.value?.click();
};

const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    selectedFile.value = file;
    selectedImageUrl.value = URL.createObjectURL(file);
    emits('file-selected', file);
  }
};

const removeImage = () => {
  selectedImageUrl.value = null;
  selectedFile.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
  emits('file-selected', null);
};
</script>
