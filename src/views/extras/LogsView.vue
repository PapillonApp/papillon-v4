<script>
    // @ts-nocheck
    import TabName from '../../components/main/TabName.vue'
    import MainItem from '../../components/main/MainItem.vue'
    import MainCategory from '../../components/main/MainCategory.vue'

    import { RefreshCcw, LogOut, Bug, Trash2, Cake, Delete } from 'lucide-vue-next';

    export default {
        components: {
            TabName,
            MainItem,
            MainCategory,
            RefreshCcw,
            LogOut,
            Bug,
            Trash2,
            Cake,
            Delete
        },
        methods: {
            updatelogs() {
                this.logs = console.logs
                this.warns = console.warns
                this.errors = console.errors,
                this.oldErrors = JSON.parse(localStorage.getItem('errors'))

                // remove empty log strings
                this.logs = this.logs.filter(log => log != '')
                this.warns = this.warns.filter(log => log != '')
                this.errors = this.errors.filter(log => log != '')
                this.oldErrors = this.oldErrors.filter(log => log != '')
            },
            emptyLogs() {
                localStorage.setItem('errors', JSON.stringify([]))

                console.logs = []
                console.warns = []
                console.errors = []

                this.updatelogs()
            }
        },
        data() {
            return {
                version : APP_VERSION,
                logs: console.logs,
                warns: console.warns,
                errors: console.errors,
                oldErrors: JSON.parse(localStorage.getItem('errors'))
            }
        },
        updated() {
            this.updatelogs()
        }
    }
</script>

<template>
    <TabName name="Logs" logged back />
    <div id="content">
        
        <MainCategory title="Logs"/>
        <div class="logs">
            <div class="log" v-for="log in logs">{{log}}</div>
            <div class="log warn" v-for="warn in warns">{{warn}}</div>
            <div class="log error" v-for="error in errors">{{error}}</div>
        </div>

        <MainCategory title="Erreurs précédentes"/>
        <div class="logs">
            <div class="log error" v-for="error in oldErrors">{{error}}</div>
        </div>

        <MainCategory title="Options"/>
        <MainItem v-on:click="emptyLogs">
            <template #icon>
                <Trash2 />
            </template>
            <template #content>
                <h3>Vider les logs</h3>
                <p>Vide les logs enregistrés sur cette page</p>
            </template>
        </MainItem>

    </div>
</template>

<style scoped>
    .logs {
        margin-top: 20px;
    }

    .log {
        border: 1px solid var(--border);
        padding: 8px 12px;
        word-break: break-word;
        font-weight: 500;
        font-size: 15px;

        border-radius: 5px;
        margin-bottom: 10px;
    }

    .warn {
        background-color: #f0e4a155;
        border: 1px solid #b3830055;
        color: #b38300;
    }

    .error {
        background-color: #f0a1a155;
        border: 1px solid #b3000055;
        color: #b30000;
    }

    @media screen and (prefers-color-scheme: dark) {
        .warn {
            background-color: #271d0055;
        }

        .error {
            background-color: #38000055;
        }
    }
</style>