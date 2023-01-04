<script>
    import TabName from '../components/main/TabName.vue'
    import NoItem from '@/components/main/NoItem.vue';

    import NotesSubject from '@/components/notes/NotesSubject.vue';
    import NotesElement from '@/components/notes/NotesElement.vue';

    import { LineChart } from 'lucide-vue-next'

    export default {
        name: 'NotesTab',
        components: {
            TabName,
            NoItem,
            NotesSubject,
            NotesElement,
            LineChart
        },
        data() {
            return {
                notes: [],
                allMarks: [],
                hasNotes: false,
                loading: true,
                inLoading: false,
                empty: false,
                error: "",
                studentAverage: "0",
                classAverage: "0",
                classMin: "0",
                classMax: "0",
                averageEvolution: [],
                graphCreated: false,
            }
        },
        methods: {
            getNotes: function() {
                // set vars
                if(this.notes) {
                    this.inLoading = true;
                }
                else { 
                    this.loading = true;
                }

                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };

                let token = localStorage.getItem('token')

                fetch(API + `/grades?token=${token}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if(result != "notfound" || result != "expired") {
                    this.inLoading = false;
                    this.graphCreated = true;

                    let marks = result;
                    
                    // add subjects to array with all their marks
                    marks.grades.forEach(mark => {
                        // create an array for the subject with name and an empty array for marks

                        // find subject index
                        let subjectIndexMain = this.notes.findIndex(subject => subject.name == mark.subject.name);

                        // get random item from baseColors
                        let randomColor = baseColors[Math.floor(Math.random() * baseColors.length)].hex;

                        if(subjectIndexMain == -1) {
                            let newSubject = {
                                name: mark.subject.name,
                                marks: [],
                                averages: {
                                    student: 0,
                                    class: 0,
                                    min: 0,
                                    max: 0
                                },
                                color: randomColor
                            }

                            this.notes.push(newSubject);
                        }

                        // add mark to subject array
                        let newMark = mark;

                        const cleanUpValue = (value) => value.toString().replace(",", ".");

                        const keysToConvert = ["value", "max", "min", "coefficient", "average", "out_of"];

                        for (const key in newMark.grade) {
                            if(keysToConvert.includes(key))
                                newMark.grade[key] = cleanUpValue(newMark.grade[key]);
                        }

                        newMark.grade.value = parseFloat(newMark.grade.value);
                        newMark.grade.max = parseFloat(newMark.grade.max);
                        newMark.grade.min = parseFloat(newMark.grade.min);
                        newMark.grade.coefficient = parseFloat(newMark.grade.coefficient);
                        newMark.grade.average = parseFloat(newMark.grade.average);
                        newMark.grade.out_of = parseFloat(newMark.grade.out_of);

                        // parse date to Date object
                        newMark.date = new Date(newMark.date);

                        // find subject index
                        let subjectIndex = this.notes.findIndex(subject => subject.name == mark.subject.name);

                        // add mark to subject
                        this.notes[subjectIndex].marks.push(newMark);
                    });

                    // add averages to subjects
                    marks.averages.forEach(average => {
                        let subjectIndex = this.notes.findIndex(subject => subject.name == average.subject.name);

                        this.notes[subjectIndex].averages.student = parseFloat(average.average.replace(",", "."));
                        this.notes[subjectIndex].averages.class = parseFloat(average.class_average.replace(",", "."));
                        this.notes[subjectIndex].averages.min = parseFloat(average.min.replace(",", "."));
                        this.notes[subjectIndex].averages.max = parseFloat(average.max.replace(",", "."));
                    });

                    this.hasNotes = true;

                    // calculate student average
                    let studentAverage = 0;
                    let studentAverageCount = 0;
                    let classAverage = 0;
                    let classAverageCount = 0;
                    let classMin = 0;
                    let classMinCount = 0;
                    let classMax = 0;
                    let classMaxCount = 0;

                    // parseFloat to avoid string concatenation
                    marks.averages.forEach(average => {
                        studentAverage += parseFloat(average.average.replace(",", "."));
                        studentAverageCount++;
                        classAverage += parseFloat(average.class_average.replace(",", "."));
                        classAverageCount++;
                        classMin += parseFloat(average.min.replace(",", "."));
                        classMinCount++;
                        classMax += parseFloat(average.max.replace(",", "."));
                        classMaxCount++;
                    });

                    this.studentAverage = parseFloat(studentAverage / studentAverageCount).toFixed(2);
                    this.classAverage = parseFloat(classAverage / classAverageCount).toFixed(2);
                    this.classMin = parseFloat(classMin / classMinCount).toFixed(2);
                    this.classMax = parseFloat(classMax / classMaxCount).toFixed(2);

                    if(result.overall_average) {
                        this.studentAverage = parseFloat(result.overall_average.replace(",", "."));
                    }

                    // get all marks
                    let markList = marks.grades;

                    // sort marks by date
                    markList.sort((a, b) => {
                        return b.date - a.date;
                    });

                    let allMarksList = [];
                    markList.forEach(mark => {
                        if(!isNaN(mark.grade.value) && !isNaN(mark.grade.out_of)) {
                            allMarksList.push(mark.grade.value / mark.grade.out_of * 20);
                        }
                    });

                    // sort marks by date
                    allMarksList.sort((a, b) => {
                        return b.date - a.date;
                    });

                    let averageEvolution = [];

                    // for each mark, calculate the average until this mark
                    allMarksList.forEach(mark => {
                        // calculate average
                        let average = 0;
                        let averageCount = 0;

                        allMarksList.forEach(mark2 => {
                            average += mark2;
                            averageCount++;
                        });

                        let FinalAverage = average / averageCount;
                        averageEvolution.push(FinalAverage.toFixed(2));

                        // remove mark from list
                        let markIndex = allMarksList.indexOf(mark);
                        allMarksList.splice(markIndex, 1);
                    });

                    this.averageEvolution = averageEvolution;
                    document.dispatchEvent(new Event('updatedGraph'));
                }
                else {
                    refreshToken();
                }
                })
                
                // sort subject marks by date
                this.notes.forEach(subject => {
                    subject.marks.sort((a, b) => {
                        let bDate = new Date(a.date);
                        let aDate = new Date(b.date);

                        return bDate - aDate;
                    });
                });

                // invert subject marks
                this.notes.forEach(subject => {
                    subject.marks.reverse();
                });

                // sort subjects by date
                this.notes.sort((a, b) => {
                    let bDate = new Date(a.marks[0].date);
                    let aDate = new Date(b.marks[0].date);

                    return bDate - aDate;
                });

                console.log(this.notes);
            }
        },
        mounted() {
            this.getNotes();

            document.addEventListener('updatedToken', () => {
                this.getNotes()
            })

            document.addEventListener('updatedGraph', () => {
                // create chart
                let ctx = document.getElementById('myChart').getContext('2d');

                // get brand color
                let brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-color');

                let myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: this.averageEvolution,
                        datasets: [{
                            label: 'Évolution de la moyenne',
                            data: this.averageEvolution,
                            borderWidth: 4,
                            borderColor: brandColor,
                            pointRadius: 0,
                            borderCapStyle: 'round',
                            cubicInterpolationMode : 'monotone',
                            tension: 1
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Évolution de la moyenne'
                            }
                        }
                    }
                });
            })
        }
    }
</script>

<template>
    <TabName name="Résultats" logged />
    <div class="quietLoading" v-if="inLoading">
        <div class="quietLoadingBar"></div>
    </div>
    <div id="content">
        <NotesSubject
            v-for="(subject, index) in notes"
            :name="subject.name"
            :average="subject.averages.student"
            :color="subject.color"
            :index="index">
            <template #grades>
                <NotesElement
                    v-for="(mark, index) in subject.marks"
                    :subject="subject.name"
                    :description="mark.description"
                    :mark="mark.grade.value"
                    :scale="mark.grade.out_of"
                    :average="mark.grade.average"
                    :min="mark.grade.min"
                    :max="mark.grade.max"
                    :coeff="mark.grade.coefficient"
                    :date="mark.date"
                    :index="index"
                    />
            </template>
        </NotesSubject>

        <NotesSubject
            v-if="hasNotes"
            name="Moyenne générale"
            class="averageFinal myAverage"
            :average="studentAverage"
            :index="notes.length">
        </NotesSubject>

        <NotesSubject
            v-if="hasNotes"
            name="Moyenne de classe"
            class="averageFinal"
            :average="classAverage"
            :index="notes.length">
        </NotesSubject>

        <div class="extremes">
            <NotesSubject
                v-if="hasNotes"
                name="Moyenne -"
                class="averageFinal"
                :average="classMin"
                :index="notes.length">
            </NotesSubject>

            <NotesSubject
                v-if="hasNotes"
                name="Moyenne +"
                class="averageFinal"
                :average="classMax"
                :index="notes.length">
            </NotesSubject>
        </div>

        <div class="graph averageGraph">
            <canvas id="myChart" width="400" height="200"></canvas>
        </div>
    </div>
</template>

<style scoped>
    .graph {
        background-color: var(--element);
        padding: 10px;
        border-radius: 12px;
        box-shadow: var(--shadow);
        zoom: 0.9;
        margin-top: 20px;
    }

    .extremes {
        display: flex;
        flex-direction: row;
        gap: 15px;
        opacity: 0.5;
    }

    .extremes .averageFinal {
        width: 50%;
    }
</style>
