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
        },
        logged: {
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
                rnString = rn.getFullYear() + "-" + lz(rn.getMonth() + 1) + "-" + lz(rn.getDate());

                updateDateStrings()
                document.getElementById('rnPicker').value = dateStr;
                document.getElementById('CalendarString').innerHTML = dateStrShow;

                document.dispatchEvent(new CustomEvent('dateChanged'));
            });

            document.addEventListener('nextDate', function() {
                let newDate = new Date();
                newDate.setDate(rn.getDate() + 1);
                let newDateStr = newDate.getFullYear() + '-' + lz(newDate.getMonth() + 1) + '-' + lz(newDate.getDate());
                rnPicker.value = newDateStr;
                rnPicker.dispatchEvent(new Event('change'));
            });

            document.addEventListener('prevDate', function() {
                let newDate = new Date();
                newDate.setDate(rn.getDate() - 1);
                let newDateStr = newDate.getFullYear() + '-' + lz(newDate.getMonth() + 1) + '-' + lz(newDate.getDate());
                rnPicker.value = newDateStr;
                rnPicker.dispatchEvent(new Event('change'));
            });
        })
    }

    let avatar = "";

    if (props.logged) {
        let userData = JSON.parse(localStorage.getItem('userData'))
        avatar = userData.avatar;

        document.addEventListener('userDataUpdated', () => {
            let userData = JSON.parse(localStorage.getItem('userData'))
            avatar = userData.avatar;
        })
    }
</script>

<template>
    <div id="TabName">
        <div class="tabLeft">
            <PapillonLogo id="PapillonLogo" />
            <p id="TabNameString">{{name}}</p>
        </div>
        <div class="tabRight">
            <label id="CalendarLabel" for="rnPicker" v-wave onclick="document.getElementById('rnPicker').showPicker()">
                <div id="Calendar" v-if="calendar">
                    <CalendarDays />
                    <p id="CalendarString">1 jan.</p>
                    <input type="date" id="rnPicker" />
                </div>
            </label>

            <RouterLink v-if="logged" to="/settings" id="avatar" v-wave>
                <img :src="avatar" />
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
    #TabName {
        position: fixed;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #FFFFFF 50%, #FFFFFF00 100%);
    
        width: calc(100vw - 24px * 2);

        padding: 20px 24px;
        display: flex;

        align-items: flex-start;
        z-index: 99999;
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


        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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

    .tabLeft {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex: 1;
        overflow: hidden !important;
    }

    .tabRight {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        width: fit-content;
        transform: translateY(-8px);
    }

    #avatar {
        border-radius: 50%;
    }

    #avatar img {
        height: 36px;
        width: 36px;
        border-radius: 50%;
        object-fit: cover;
    }

    #CalendarLabel {
        color: var(--brand-color);
        border-radius: 5px;
        margin-right: 10px;
        font-weight: 600;
    }

    #Calendar {
        background: rgba(0, 181, 98, 0.1);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        align-items: flex-end;
        padding: 7px 6px !important;
        gap: 4px;
        border-radius: 8px;

        width: fit-content;
        padding-right: 0px !important;
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