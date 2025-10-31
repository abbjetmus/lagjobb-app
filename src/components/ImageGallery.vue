<template>
  <div v-if="images && images.length > 0">
    <div class="fixed-full image-gallery__blinder bg-grey-8"
      :class="indexZoomed !== void 0 ? 'image-gallery__blinder--active' : void 0" @click="zoomImage()" />

    <div class="row justify-start q-mx-auto scroll relative-position" style="max-width: 80vw; max-height: 80vh">
      <q-img v-for="(src, index) in images" :key="index" :ref="el => setThumbRef(el, index)"
        class="image-gallery__image q-mr-md" :style="index === indexZoomed ? 'opacity: 0.3' : void 0" :src="src"
        @click="zoomImage(index)" />
    </div>

    <q-img ref="fullRef" class="image-gallery__image image-gallery__image-full fixed-center"
      :class="indexZoomed !== void 0 ? 'image-gallery__image-full--active' : void 0"
      :src="indexZoomed !== undefined ? images[indexZoomed] : ''" @load="imgLoadedResolve" @error="imgLoadedReject"
      @click="zoomImage()" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUpdate } from 'vue'
import { morph } from 'quasar'
import type { ComponentPublicInstance } from 'vue'

interface Props {
  images: string[]
}

defineProps<Props>()

const thumbRef = ref<(ComponentPublicInstance | null)[]>([])
const fullRef = ref<ComponentPublicInstance | null>(null)

const setThumbRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el && '$el' in el) {
    thumbRef.value[index] = el
  }
}

const indexZoomed = ref<number | undefined>(undefined)
const imgLoaded = {
  promise: Promise.resolve(),
  resolve: () => { },
  reject: () => { }
}

function imgLoadedResolve() {
  imgLoaded.resolve()
}

function imgLoadedReject() {
  imgLoaded.reject()
}

function zoomImage(index?: number) {
  const indexZoomedState = indexZoomed.value

  imgLoaded.reject()

  const zoom = () => {
    if (index !== undefined && index !== indexZoomedState) {
      imgLoaded.promise = new Promise<void>((resolve, reject) => {
        imgLoaded.resolve = () => {
          imgLoaded.resolve = () => { }
          imgLoaded.reject = () => { }

          resolve()
        }
        imgLoaded.reject = () => {
          imgLoaded.resolve = () => { }
          imgLoaded.reject = () => { }

          reject(new Error())
        }
      })

      const thumbEl = thumbRef.value[index]?.$el
      const fullEl = fullRef.value?.$el

      if (thumbEl && fullEl) {
        morph({
          from: thumbEl,
          to: fullEl,
          onToggle: () => {
            indexZoomed.value = index
          },
          waitFor: imgLoaded.promise,
          duration: 400,
          hideFromClone: true,
          onEnd: (end: string) => {
            if (end === 'from' && indexZoomed.value === index) {
              indexZoomed.value = undefined
            }
          }
        })
      }
    }
  }

  if (indexZoomedState !== undefined) {
    const fullEl = fullRef.value?.$el
    const thumbEl = thumbRef.value[indexZoomedState]?.$el

    if (fullEl && thumbEl) {
      morph({
        from: fullEl,
        to: thumbEl,
        onToggle: () => {
          indexZoomed.value = undefined
        },
        duration: 200,
        keepToClone: true,
        onEnd: zoom
      })
    }
    else {
      zoom()
    }
  }
  else {
    zoom()
  }
}

onBeforeUpdate(() => {
  thumbRef.value = []
})
</script>

<style lang="scss">
.image-gallery {
  &__image {
    border-radius: 3%/5%;
    width: 150px;
    max-width: 20vw;
    cursor: pointer;

    &-full {
      width: 800px;
      max-width: 70vw;
      z-index: 2002;
      pointer-events: none;

      &--active {
        pointer-events: all;
      }
    }
  }

  &__blinder {
    opacity: 0;
    z-index: 2000;
    pointer-events: none;
    transition: opacity 0.3s ease-in-out;

    &--active {
      opacity: 0.6;
      pointer-events: all;

      +div>.image-gallery__image {
        z-index: 2001;
      }
    }
  }
}
</style>
