<script setup lang="ts">
    const props = defineProps({
        title: {
            type: String,
            required: true
        },
    })  
</script>

<template>
    <div class="category">
        <p>{{title}}</p>
        <div class="category-line"></div>
    </div>
</template>

<style>
    .category {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 24px;
    }

    .category p {
        font-size: 16px;
        line-height: 16px;
        font-weight: 700;
        margin-right: 12px;
        letter-spacing: 1px;
        margin: 0;
        padding: 0;
        opacity: 0.2;
    }

    .category-line {
        flex: 1;
        height: 2px;
        background: var(--text);
        border-radius: 2px;
        opacity: 0.1;
    }
</style>