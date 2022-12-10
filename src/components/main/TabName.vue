<script setup>
    import PapillonLogo from '../icons/PapillonLogo.vue'
    import { CalendarDays, ArrowLeft } from 'lucide-vue-next';

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
        },
        back : {
            type: Boolean,
            required: false,
            default: false
        }
    })  

    if(props.calendar) {
        /* rn */
        let dateStr = "2022-01-01";
        let dateStrShow = "1 jan.";

        function updateDateStrings() {
            let day = rn.getDate();
            let month = rn.getMonth();
            let year = rn.getFullYear();

            let monthNames = ["jan." , "fév." , "mars" , "avr." , "mai" , "juin" , "juil." , "août" , "sept." , "oct." , "nov." , "déc."];
            let monthString = monthNames[month];

            dateStr = year + '-' + lz((month + 1)) + '-' + lz(day);
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

                document.dispatchEvent(new CustomEvent('rnChanged'));
            });

            document.addEventListener('rnChanged', function() {
                updateDateStrings()
                document.getElementById('rnPicker').value = rnString;
                document.getElementById('CalendarString').innerHTML = dateStrShow;

                document.dispatchEvent(new CustomEvent('dateChanged'));
            });
        })
    }

    let avatar = "";

    if (props.logged) {
        let userData = JSON.parse(localStorage.getItem('userData'))
        avatar = userData.profile_picture;

        setInterval(() => {
            let userData = JSON.parse(localStorage.getItem('userData'))
            avatar = userData.profile_picture;
        }, 1000);
    }

    function goBack() {
        window.history.back();
    }
</script>

<template>
    <div id="TabName">
        <img :src="avatar" class="bkgImage" />

        <div class="TabNameContent">
            <div class="TabNameActions">
                <PapillonLogo class="logo" v-if="!back"/>
                <ArrowLeft class="goBack" v-if="back" v-wave @click="goBack()" />

                <RouterLink v-if="logged" to="/settings" id="avatar" v-wave>
                    <img :src="avatar" />
                </RouterLink>
            </div>

            <div class="TabNameTitle">
                <h1>{{name}}</h1>

                <label id="CalendarLabel" for="rnPicker" v-wave>
                    <div id="Calendar" v-if="calendar">
                        <CalendarDays />
                        <p id="CalendarString">1 jan.</p>
                        <input type="date" id="rnPicker" />
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .goBack {
        padding: 6.5px !important;
        color: #fff;
        background-color: #ffffff10;
        border-radius: 300px;
    }

    #TabName {
        position: fixed;
        top: 0;
        left: 0;

        height: 180px;
    
        width: 100vw;
        display: flex;

        z-index: 99999;
    }

    .bkgImage {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100%;
        object-fit: cover;
        object-position: center;
        z-index: -1;
    }

    .TabNameContent {
        width: calc(100% - 44px);
        height: calc(100% - 24px - env(safe-area-inset-top));

        background: #00000075;

        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);

        padding: 12px 22px !important;
        padding-top: calc(12px + env(safe-area-inset-top)) !important;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .TabNameActions {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: -10px;
    }

    .TabNameActions .logo {
        height: 28px;
        filter: invert(1);
    }

    .TabNameTitle {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px !important;
    }

    .TabNameTitle h1 {
        font-size: 25px;
        font-weight: 700;
        color: #fff;
    }

    #TabName * {
        margin: 0;
        padding: 0;
    }

    #avatar {
        border-radius: 50%;
        height: 36px;
        width: 36px;
        margin-top: -2px;
    }

    #avatar img {
        height: 36px;
        width: 36px;
        border-radius: 50%;
        object-fit: cover;
    }

    #CalendarLabel {
        color: #fff;
        border-radius: 300px;
        font-weight: 600;
        margin-top: -2px;
    }

    #Calendar {
        background: #ffffff22;
        border: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        align-items: center;
        padding: 7px 8px !important;
        gap: 5px;
        border-radius: 300px;

        

        width: fit-content;
        padding-right: 0px !important;
    }

    #Calendar * {
        color: #fff;
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
        margin-top: 2px;
        font-weight: 600;
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