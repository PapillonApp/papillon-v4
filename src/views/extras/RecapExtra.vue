<script>
    // @ts-nocheck
    import TabName from '../../components/main/TabName.vue'
    import MainItem from '../../components/main/MainItem.vue'
    import MainCategory from '../../components/main/MainCategory.vue'

    import LoadingItem from '@/components/main/LoadingItem.vue';

    import { createCanvas, loadImage } from 'canvas'

    import { RefreshCcw, LogOut, Bug, Trash2 } from 'lucide-vue-next';

    import { Stories } from "vue-insta-stories";

    let userData = JSON.parse(localStorage.getItem('userData'))

    let avatar = userData.avatar;
    let name = userData.name;
    let establishment = userData.establishment.name;
    let className = userData.studentClass.name;

    let firstName = name.split(' ').pop();

    export default {
        data() {
            return {
                avatar : avatar,
                firstName : firstName,
                establishment : establishment,
                className : className,
                version : APP_VERSION,
                userData : userData,
                items: [
                    "/retrospective/diap1.jpg",
                ],
                diapLoaded : 1,
                marks : [],
                edt: [],
            }
        },
        components: {
            TabName,
            MainItem,
            MainCategory,
            Stories,
            LoadingItem,
        },
        methods: {
            getMarks() {
                let schema = `
                    {
                        marks(period: "*") {
                            subjects {
                                name,
                                color,
                                averages {
                                    student,
                                    studentClass,
                                    min,
                                    max
                                }
                                marks {
                                    id,
                                    title,
                                    value,
                                    scale,
                                    average,
                                    coefficient,
                                    min,
                                    max,
                                    date,
                                    isAway
                                }
                            }   
                        }
                    }
                `;

                sendQL(schema).then((response) => {
                    this.marks = response.data.marks.subjects;

                    this.getDiap2Data();
                    this.getDiap3Data();
                })
            },
            getDiap2Data() {
                // get worst and best mark
                let worstMark = [];
                let bestMark = [];

                // get marks
                let marks = this.marks;
                console.log(marks);

                // get best and worse subject average
                let bestAverage = 0;
                let worstAverage = 100;

                let bestSubject = "";
                let worstSubject = "";

                for (let i = 0; i < marks.length; i++) {
                    let subject = marks[i];

                    if (subject.averages.student > bestAverage) {
                        bestAverage = subject.averages.student;
                        bestSubject = subject.name;
                    }

                    if (subject.averages.student < worstAverage) {
                        worstAverage = subject.averages.student;
                        worstSubject = subject.name;
                    }

                    for (let j = 0; j < subject.marks.length; j++) {
                        let mark = subject.marks[j];

                        if (mark.value < worstMark.value || worstMark.length == 0) {
                            worstMark = mark;
                        }

                        if (mark.value > bestMark.value || bestMark.length == 0) {
                            bestMark = mark;
                        }
                    }   

                }

                    this.genDiap2(bestAverage, worstAverage, bestSubject, worstSubject, bestMark, worstMark);
                    console.log(bestMark);
            },
            genDiap2(bestAverage, worstAverage, bestSubject, worstSubject, bestMark, worstMark) {
                const canvas = createCanvas(720, 1280)
                const ctx = canvas.getContext('2d')

                // separer les notes et la virgule
                let bestMarkValue = bestAverage.toString().split('.');
                let worstMarkValue = worstAverage.toString().split('.');

                // get diap2 image from /retrospective/diap2.svg
                // and draw it on the canvas
                loadImage('/retrospective/diap2.jpg').then((image) => {
                    ctx.drawImage(image, 0, 0, 720, 1280)

                    // add 1st text
                    ctx.fillStyle = '#ffffff'

                    let xPos = 400;

                    ctx.font = 'bold  86px papillon'
                    ctx.fillText(bestMarkValue[0], 120, xPos)

                    ctx.font = 'bold  48px papillon'
                    ctx.fillText("." + bestMarkValue[1] + " /20", 220, xPos)

                    ctx.font = '32px papillon'
                    ctx.fillText('en ' + bestSubject, 120, xPos + 50)

                    // add 2nd text
                    ctx.fillStyle = '#ffffff'
                    ctx.strokeStyle = '#000'
                    ctx.strokeWidth = 1

                    xPos = 730;

                    ctx.font = 'bold  86px papillon'
                    ctx.fillText(worstMarkValue[0], 120, xPos)

                    ctx.font = 'bold  48px papillon'
                    ctx.fillText("." + worstMarkValue[1] + " /20", 220, xPos)

                    ctx.font = '32px papillon'
                    ctx.fillText('en ' + worstSubject, 120, xPos + 50)

                    // push the canvas to the items array
                    this.items.push(canvas.toDataURL())
                    this.diapLoaded += 1
                })
            },
            getDiap3Data() {
                // get worst and best mark
                let worstMark = [];
                let bestMark = [];

                // get marks
                let marks = this.marks;

                    for (let i = 0; i < marks.length; i++) {
                        let subject = marks[i];

                        for (let j = 0; j < subject.marks.length; j++) {
                            let mark = subject.marks[j];

                            if (mark.scale == 20) {
                                if (worstMark.length == 0) {
                                    worstMark = [mark, subject];
                                } else {
                                    if (mark.average < worstMark[0].average) {
                                        worstMark = [mark, subject];
                                    }
                                }

                                if (bestMark.length == 0) {
                                    bestMark = [mark, subject];
                                } else {
                                    if (mark.average > bestMark[0].average) {
                                        bestMark = [mark, subject];
                                    }
                                }
                            }
                        }

                    }


                    this.genDiap3(bestMark, worstMark);
                    console.log(bestMark);
            },
            genDiap3(bestMark, worstMark) {
                const canvas = createCanvas(720, 1280)
                const ctx = canvas.getContext('2d')

                // convertir la note en tofixed(2)
                bestMark[0].average = parseInt(bestMark[0].average).toFixed(2);
                worstMark[0].average = parseInt(worstMark[0].average).toFixed(2);

                // separer les notes et la virgule
                let bestMarkValue = bestMark[0].average.toString().split('.');
                let worstMarkValue = worstMark[0].average.toString().split('.');

                // get date string of both marks
                let bestMarkDate = new Date(bestMark[0].date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                let worstMarkDate = new Date(worstMark[0].date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                // get diap2 image from /retrospective/diap2.svg
                // and draw it on the canvas
                loadImage('/retrospective/diap3.jpg').then((image) => {
                    ctx.drawImage(image, 0, 0, 720, 1280)

                    // add 1st text
                    ctx.fillStyle = '#ffffff'

                    let xPos = 400;

                    ctx.font = 'bold  86px papillon'
                    ctx.fillText(bestMarkValue[0], 120, xPos)

                    ctx.font = 'bold  48px papillon'
                    ctx.fillText("." + bestMarkValue[1] + " /" + bestMark[0].scale, 220, xPos)

                    ctx.font = '32px papillon'
                    ctx.fillText('en ' + bestMark[1].name, 120, xPos + 50)

                    ctx.font = '26px papillon'
                    ctx.fillText('le ' + bestMarkDate, 120, xPos + 85)

                    // add 2nd text
                    ctx.fillStyle = '#ffffff'
                    ctx.strokeStyle = '#000'
                    ctx.strokeWidth = 1

                    xPos = 730;

                    ctx.font = 'bold  86px papillon'
                    ctx.fillText(worstMarkValue[0], 120, xPos)

                    ctx.font = 'bold  48px papillon'
                    ctx.fillText("." + worstMarkValue[1] + " /" + worstMark[0].scale, 220, xPos)

                    ctx.font = '32px papillon'
                    ctx.fillText('en ' + worstMark[1].name, 120, xPos + 50)

                    ctx.font = '26px papillon'
                    ctx.fillText('le ' + worstMarkDate, 120, xPos + 85)

                    // push the canvas to the items array
                    this.items.push(canvas.toDataURL())
                    this.diapLoaded += 1

                    this.genDiap4();
                })
            },
            genDiap4() {
                const canvas = createCanvas(720, 1280)
                const ctx = canvas.getContext('2d')

                // get all groups from userData
                let groups = this.userData.groups;

                // get diap2 image from /retrospective/diap2.svg
                // and draw it on the canvas
                loadImage('/retrospective/diap4.jpg').then((image) => {
                    ctx.drawImage(image, 0, 0, 720, 1280)

                    let xPos = 450;

                    // for each group name, add it to the canvas
                    for (let i = 0; i < groups.length; i++) {
                        let group = groups[i];

                        ctx.fillStyle = '#ffffff'
                        ctx.strokeStyle = '#000'
                        ctx.strokeWidth = 1

                        ctx.font = '32px papillon'
                        ctx.fillText(group.name, 48, xPos + (i * 40))
                    }

                    // push the canvas to the items array
                    this.items.push(canvas.toDataURL())
                    this.diapLoaded += 1

                    this.items.push('/retrospective/diap5.jpg')
                    this.diapLoaded += 1
                })
            },
        },
        created() {
            this.getMarks();
        }
    }
</script>

<template>
    <TabName name="Mon récap 2022" logged />
    <div id="content">

        <LoadingItem v-if="(diapLoaded < 4)" title="Téléchargement de votre récapitulatif..." subtitle="Veuillez patienter..." />

        <Stories v-if="(diapLoaded >= 4)" :stories="items" :interval="10000" :loop="true"/>

    </div>
</template>

<style scoped>
    .vue-insta-stories {
        background: black;
        width: 100vw;
        height: calc(100% - 133px - env(safe-area-inset-bottom) * 1.4);
    
        position: absolute;
        left: 0;
    }
</style>