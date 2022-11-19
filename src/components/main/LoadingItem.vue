<script lang="ts">
    export default {
        props: ['title', 'subtitle'],
    }
</script>

<template>
    <div class="noItem">
        <div class="noItem_icon">
            <span class="loader"></span>
        </div>
        <h3>{{title}}</h3>
        <p>{{subtitle}}</p>
    </div>
</template>

<style>
    .loader {
        width: 48px;
        height: 48px;
        border: 5px solid;
        border-color: var(--brand-color) transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 

    .noItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 40vh;
        text-align: center;
        margin: 30px;
        color: var(--text)
    }

    .noItem * {
        margin: 0;
        padding: 0;
    }

    .noItem_icon * {
        margin-bottom: 24px !important;
    }

    .noItem h3 {
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 10px;
    }

    .noItem p {
        font-size: 18px;
        line-height: 18px;
        color: var(--text-light);
        opacity: 50%;
    }
</style>