<script lang="ts">
    export default {
        props: {
            time: {
                type: String,
                required: true
            },
            wait: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            room: {
                type: String,
                required: true
            },
            teacher: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true
            }
        },
        mounted() {
            let color = this.color
            if(this.color == undefined) {
                color = '#00B562'
            }
            this.$el.style.setProperty('--color', color)
        }
    };
 
</script>

<template>
    <div class="cours" v-wave>
        <div class="cours-color"></div>
        <div class="cours-data">
            <small>{{time}} - {{wait}}</small>
            <h3>{{name}}</h3>
            <p>{{room}} - {{teacher}}</p>
        </div>
    </div>
</template>

<style scoped>
    .cours {
        width: 100%;
        flex: none;
        order: 0;
        flex-grow: 0;

        background: var(--element);
        color: var(--text);

        border-radius: 10px;

        display: flex;
        overflow: hidden;

        opacity: 0%;
        animation: TabNameStringUp 0.2s cubic-bezier(0,0,0,1) forwards;
    }

    .cours * {
        margin: 0;
        padding: 0;
    }

    .cours-color {
        width: 6px;
        background: var(--color);
        border-radius: 10px 0px 0px 10px;
    }

    .cours-data {
        padding: 11px;
        padding-left: 17px;
    }

    .cours-data small {
        opacity: 0.3;
        font-size: 15px;
        line-height: 15px;
        letter-spacing: 0.005em;
        text-align: left;
        margin-bottom: 5px;
    }

    .cours-data h3 {
        font-size: 20px;
        line-height: 20px;
        letter-spacing: 0.005em;
        text-align: left;
        color: var(--color);
        margin-bottom: 15px;
    }

    .cours-data p {
        font-size: 15px;
        line-height: 15px;
        letter-spacing: 0.005em;
        text-align: left;
        opacity: 0.5;
        text-transform: none;
    }
</style>