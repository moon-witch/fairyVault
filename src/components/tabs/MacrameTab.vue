<script setup lang="ts">
import CardTemplate from './../cards/CardTemplate.vue';
</script>

<template>
    <div>
        <CardTemplate link="aTsC_GP6_sI?si=Tp3g9WwNuyyKAl3v" photo="jade_leafy_bracelet.jpg" header="big leafy thing">
            <template v-slot:notes-1>
                hello
            </template>
            <template v-slot:notes-2>
                helloo
            </template>
        </CardTemplate>
    </div>
</template>

<style scoped lang="scss">

</style>