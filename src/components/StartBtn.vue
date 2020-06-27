<template>
    <v-btn :color="color" @click="$emit('start')">{{text}}</v-btn>   
</template>

<script>
export default {
    name: "StartBtn",
    props: ["color", "text"]
}
</script>