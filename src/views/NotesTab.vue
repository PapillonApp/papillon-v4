<script lang="ts">
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
                hasNotes: false,
                loading: true,
                inLoading: false,
                empty: false,
                error: "",
                studentAverage: "0",
                classAverage: "0",
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

                // get token
                let token = localStorage.getItem('token')
                
                // get marks url
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

                // get marks
                sendQL(schema).then((response) => {
                    this.inLoading = false;

                    let marks = response.data.marks.subjects;
                    if(marks.length == 0) {
                        this.empty = true;
                    }
                    else {
                        this.empty = false;
                        this.hasNotes = true;
                    }

                    // sort by latest mark date
                    marks.sort((a, b) => {
                        let aDate = new Date(a.marks[a.marks.length - 1].date);
                        let bDate = new Date(b.marks[b.marks.length - 1].date);

                        return bDate - aDate;
                    });

                    this.notes = marks;

                    // calculate averages
                    let studentAverage = 0;
                    let classAverage = 0;
                    let studentAverageCount = 0;
                    let classAverageCount = 0;

                    for(let i = 0; i < this.notes.length; i++) {
                        let subject = this.notes[i];
                        let studentAverageSubject = subject.averages.student;
                        let classAverageSubject = subject.averages.studentClass;

                        if(studentAverageSubject != null) {
                            studentAverage += studentAverageSubject;
                            studentAverageCount++;
                        }

                        if(classAverageSubject != null) {
                            classAverage += classAverageSubject;
                            classAverageCount++;
                        }
                    }

                    if(studentAverageCount != 0) {
                        studentAverage = studentAverage / studentAverageCount;
                    }

                    if(classAverageCount != 0) {
                        classAverage = classAverage / classAverageCount;
                    }

                    this.studentAverage = studentAverage.toFixed(2);
                    this.classAverage = classAverage.toFixed(2);
                })
            }
        },
        mounted() {
            this.getNotes()
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
                    :description="mark.title"
                    :mark="mark.value"
                    :scale="mark.scale"
                    :average="mark.average"
                    :min="mark.min"
                    :max="mark.max"
                    :coeff="mark.coefficient"
                    :date="mark.date"
                    :isAway="mark.isAway"
                    :index="index"
                    />
            </template>
        </NotesSubject>

        <NotesSubject
            v-if="hasNotes"
            name="Moyenne générale"
            class="averageFinal"
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
    </div>
</template>

<style scoped>
</style>