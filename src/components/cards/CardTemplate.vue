<script setup lang="ts">
const props = defineProps({
  link: {
    type: String,
    required: true,
  },
  header: {
    type: String,
    required: true,
  },
});

const YTlink = "https://www.youtube.com/embed/" + props.link;
</script>

<template>
  <div class="card-container">
    <div class="header">
      {{ header }}
    </div>
    <div class="image-content">
      <div class="yt-embed">
        <iframe
          width="200rem"
          height="120rem"
          :src="YTlink"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    <div class="notes-1">
      <h3>Materials</h3>
      <slot name="notes-1" />
    </div>
    <div class="notes-2">
      <h3>Good to know</h3>
      <slot name="notes-2" />
    </div>
    <div class="action">
      <slot name="action"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid $bg-dark;
  border-radius: 50px;
  padding: 2rem;
  margin: 0 1rem 2rem 1rem;

  .image-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;

    iframe {
      border-radius: 10px;
    }

    img {
      border-radius: 10px;
      width: 13rem;
    }

    @media (max-width: 1023px) {
      flex-direction: column;
      max-width: 30rem;
      margin: 2rem;
    }
  }

  .header {
    font-weight: 600;
    padding: 0.2rem 2rem;
    margin: 0.5rem 0;
    color: $primary;
    background: $bg-bright;
    border-radius: 50px;
    text-transform: uppercase;
  }

  h3 {
    padding: 0.1rem 1rem;
    margin: 0.5rem 0;
    color: $primary;
    background: $bg-bright;
    border-radius: 50px;
  }

  .notes-1 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
  }

  .notes-2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
  }

  .action {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }
}
</style>
