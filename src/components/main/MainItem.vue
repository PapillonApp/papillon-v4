<script lang="ts">
</script>

<template>
    <div class="mainItem" v-wave>
        <div class="mainItem_icon mainItem_el">
            <slot name="icon"></slot>
        </div>
        <div class="mainItem_content mainItem_el">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<style>
    .mainItem {
        display: flex;
        padding: 10px 20px;
        border-radius: 10px;
        background-color: var(--element);
        color: var(--text);
        align-items: center;
        gap: 18px;
        margin-top: 10px;
    }

    .mainItem_el * {
        margin: 0;
        padding: 0;
    }

    .mainItem_content {
        display: flex;
        flex-direction: column;
        padding-top: 3px;
    }

    .mainItem_content h3 {
        font-size: 18px;
        line-height: 18px;
        font-weight: 600;
        margin-bottom: 5px;
        transform: translateY(1px);
    }

    .mainItem_content p {
        font-size: 15px;
        line-height: 15px;
        opacity: 50%;
    }
</style>