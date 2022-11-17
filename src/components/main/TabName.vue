<script setup>
    import PapillonLogo from '../icons/PapillonLogo.vue'
    import { CalendarDays } from 'lucide-vue-next';

    import { ref, onMounted } from 'vue'

    /* props */
    const props = defineProps({
        name: {
            type: String,
            required: true
        },
        calendar: {
            type: Boolean,
            required: false,
            default: false
        }
    })  

    if(props.calendar) {
        /* rn */
        let dateStr = "2022/01/01";
        let dateStrShow = "1 jan.";

        function updateDateStrings() {
            let day = rn.getDate();
            let month = rn.getMonth();
            let year = rn.getFullYear();

            let monthNames = ["jan." , "fév." , "mars" , "avr." , "mai" , "juin" , "juil." , "août" , "sept." , "oct." , "nov." , "déc."];
            let monthString = monthNames[month];

            dateStr = year + '-' + (month + 1) + '-' + day;
            dateStrShow = day + ' ' + monthString;
        }

        updateDateStrings();

        /* apply rn */
        onMounted(() => {
            document.getElementById('rnPicker').value = dateStr;
            document.getElementById('CalendarString').innerHTML = dateStrShow;

            /* if rn changes */
            document.getElementById('rnPicker').addEventListener('change', function() {
                rn = new Date(this.value);

                updateDateStrings()
                document.getElementById('rnPicker').value = dateStr;
                document.getElementById('CalendarString').innerHTML = dateStrShow;

                document.dispatchEvent(new CustomEvent('dateChanged'));
            });
        })
    }
</script>

<template>
    <div id="TabName">
        <PapillonLogo id="PapillonLogo" />
        <p id="TabNameString">{{name}}</p>

        <label id="CalendarLabel" for="rnPicker" v-wave onclick="document.getElementById('rnPicker').showPicker()">
            <div id="Calendar" v-if="calendar">
                <CalendarDays />
                <p id="CalendarString">1 jan.</p>
                <input type="date" id="rnPicker" />
            </div>
        </label>
    </div>
</template>

<style scoped>
    #TabName {
        position: fixed;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #FFFFFF 50%, #FFFFFF00 100%);
    
        width: calc(100vw);

        padding: 20px 24px;
        display: flex;

        align-items: center;
    }

    #TabName * {
        margin: 0;
        padding: 0;
    }

    #PapillonLogo {
        height: 28px;
        padding-right: 18px;
    }

    #TabNameString {
        font-size: 18px;
        line-height: 18px;
        letter-spacing: 0.005em;
        text-align: left;
        transform: translateY(1px);

        font-weight: 600;

        opacity: 0%;
        animation: TabNameString 0.2s cubic-bezier(0,0,0,1) forwards;

        position: absolute;
        left: 72px;
    }

    @media screen and (prefers-color-scheme: dark) {
        #TabNameString {
            color: #FFFFFF;
        }

        #TabName {
            background: linear-gradient(180deg, #0f0f0f 50%, #0f0f0f00 100%);
        }

        #PapillonLogo {
            filter: invert(1);
        }
    }

    #CalendarLabel {
        position: absolute;
        right: 24px;
        margin-top: -3px;
        color: var(--brand-color);
        border-radius: 5px;
    }

    #Calendar {
        background: rgba(0, 181, 98, 0.1);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        align-items: flex-end;
        padding: 7px 9px !important;
        gap: 4px;
        border-radius: 8px;

        padding-right: 2px !important;
    }

    #Calendar * {
        color: var(--brand-color);
    }

    #Calendar svg {
        width: 24px;
        height: 24px;
        flex: none;
        order: 0;
        flex-grow: 0;
    }

    #CalendarString {
        font-size: 18px;
        line-height: 18px;
        letter-spacing: 0.005em;
        text-align: right;
    }

    /* Hide the date input but not picker */
    #rnPicker {
        max-width: 0px !important;
        max-height: 0px !important;
        opacity: 0%;
        padding: 0px !important;
        font-size: 0px !important;
    }

</style>