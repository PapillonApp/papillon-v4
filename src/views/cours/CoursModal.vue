<script lang="ts">
    export default {
        props: {
            subject: {
                type: String,
                required: true
            },
        },
        mounted() {
            console.log(this.subject)
        }
    }
</script>

<template>
    <div class="modal">
        
    </div>
</template>

<style scoped>

</style>