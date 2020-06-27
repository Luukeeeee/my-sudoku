<template>
<v-container fill-height justify-center>
    <v-container fill-height justify-center v-if="show">
        <v-card max-width="300">
            <v-img src="sudokupic.jpg"></v-img>
            <v-card-actions>
                <v-row class="justify-center">
                    <v-btn class="grey lighten-4" text @click="start">start</v-btn>
                </v-row>
                <v-row class="justify-center">
                    <v-btn class="grey lighten-4" text @click="load">load</v-btn>
                </v-row>
            </v-card-actions>
        </v-card>

    </v-container>
    <v-container fill-height justify-center v-if="!show">
        <v-row>
            <v-col cols="12" lg="3" md="3" sm="3" xs="3" x-small>
                <h3>Level:{{ level }}</h3>
            </v-col>
            <v-col cols="12" lg="2" md="2" sm="2" xs="2" x-small>
                <v-btn class="grey lighten-4" text @click="clear">clear all</v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" lg="2" md="2" sm="2" xs="2" x-small>
                <v-btn class="grey lighten-4" text @click="save">save</v-btn>
            </v-col>
            <v-col cols="12" lg="2" md="2" sm="2" xs="2" x-small>
                <v-btn class="grey lighten-4" text @click="load">load</v-btn>
            </v-col>
            <v-col cols="12" lg="3" md="3">
                Choose sudoku level:
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="success" text dark v-bind="attrs" v-on="on">
                            {{chooseLevel}}
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="start('any')">
                            <v-list-item-title>any</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="start('easy')">
                            <v-list-item-title>easy</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="start('medium')">
                            <v-list-item-title>medium</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="start('hard')">
                            <v-list-item-title>hard</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <!-- <StartBtn color="primary" text="easy" v-on:start="start('easy')" /> -->
            </v-col>
        </v-row>
        <div id="plate" color="grey lighten-5">
            <v-menu v-for="(number, index) in content" :key="index" offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <button class="btn" :class="number.color" :id="`btn${index}`" :disabled="number.disable" v-on="on" v-bind="attrs">
                        {{ number.num }}
                    </button>
                </template>
                <v-card width="216">
                    <v-container>
                        <v-btn v-for="n in 9" :key="n" text @click="chooseNumber(index, n)">
                            {{ n }}
                        </v-btn>
                    </v-container>
                </v-card>
            </v-menu>
        </div>
        <v-dialog v-model="dialog" scrollable :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card width="400" height="300">
                <v-card-text>
                    <v-container fill-height justify-center>
                        <span class="title" style="color: red">{{msg}}</span>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-btn text class="primary ml-8 mb-8" icon dark @click="() => this.dialog = false">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="success mr-8 mb-8" @click="() => {this.start(this.chooseLevel); this.dialog = false}" text>next</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</v-container>
</template>

<script>
import axios from "axios";
//import StartBtn from "./StartBtn.vue"

export default {
    name: "Home",
    // components: {
    //     StartBtn
    // },
    methods: {
        start(e) {
            axios.get('js/data.json').then((response) => {
                this.data = response.data
            }).then(() => {
                let i = 0;
                // need this otherwise this.data would be changed according to change of this.content
                if (e == "easy") {
                    i = Math.floor(Math.random() * this.easy.length);
                    this.content = JSON.parse(JSON.stringify(this.easy[i].content));
                    this.level = "easy";
                    this.chooseLevel = "easy";
                } else if (e == "medium") {
                    i = Math.floor(Math.random() * this.medium.length);
                    this.content = JSON.parse(JSON.stringify(this.medium[i].content));
                    this.level = "medium";
                    this.chooseLevel = "medium";
                } else if (e == "hard") {
                    i = Math.floor(Math.random() * this.hard.length);
                    this.content = JSON.parse(JSON.stringify(this.hard[i].content));
                    this.level = "hard";
                    this.chooseLevel = "hard";
                } else {
                    i = Math.floor(Math.random() * this.data.length);
                    this.content = JSON.parse(JSON.stringify(this.data[i].content));
                    this.level = this.data[i].level;
                    this.chooseLevel = "any";
                }
                this.number = i;
                this.show = false;
            })
        },
        chooseNumber(index, n) {
            this.content[index].num = n;
            this.content[index].color = "pink--text";
            if (this.numbers.indexOf("?") < 0) {
                for (let i = 0; i < this.numbersArr.length; i++) {
                    for (let j = 1; j < 10; j++) {
                        if (this.numbersArr[i].indexOf(j) < 0) {
                            this.msg = "There is some mistake, please check.";
                            this.dialog = true;
                            return;
                        }
                        this.dialog = true;
                        this.msg = "Congradulations!! You have solved this sudoku!!";
                    }
                }

            }
        },
        clear() {
            this.content = JSON.parse(JSON.stringify(this.data[this.number].content));
        },
        save() {
            window.localStorage.setItem("content", JSON.stringify(this.content));
            window.localStorage.setItem("level", this.level);
            window.localStorage.setItem("number", this.number);
        },
        load() {
            this.show = false;
            this.content = JSON.parse(window.localStorage.getItem("content"));
            this.level = window.localStorage.getItem("level");
            this.chooseLevel = window.localStorage.getItem("level");
            this.number = window.localStorage.getItem("number");
        }
    },
    beforeMount() {

    },
    computed: {
        easy() {
            let arr = [];
            this.data.forEach(item => {
                if (item.level == "easy") {
                    arr.push(item);
                }
            })
            return arr;
        },
        medium() {
            let arr = [];
            this.data.forEach(item => {
                if (item.level == "medium") {
                    arr.push(item);
                }
            })
            return arr;
        },
        hard() {
            let arr = [];
            this.data.forEach(item => {
                if (item.level == "hard") {
                    arr.push(item);
                }
            })
            return arr;
        },
        numbers() {
            let numbers = [];
            for (let i = 0; i < 81; i++) {
                numbers.push(this.content[i].num);
            }
            return numbers;
        },
        numbersRow1() {
            return this.numbers.slice(0, 9);
        },
        numbersRow2() {
            return this.numbers.slice(9, 18);
        },
        numbersRow3() {
            return this.numbers.slice(18, 27);
        },
        numbersRow4() {
            return this.numbers.slice(27, 36);
        },
        numbersRow5() {
            return this.numbers.slice(36, 45);
        },
        numbersRow6() {
            return this.numbers.slice(45, 54);
        },
        numbersRow7() {
            return this.numbers.slice(54, 63);
        },
        numbersRow8() {
            return this.numbers.slice(63, 72);
        },
        numbersRow9() {
            return this.numbers.slice(72, 81);
        },
        numbersCol1() {
            let numbers = [];
            for (let i = 0; i < 81; i += 9) {
                numbers.push(this.content[i].num);
            }
            return numbers;
        },
        numbersCol2() {
            let numbers = [];
            for (let i = 1; i < 81; i += 9) {
                numbers.push(this.content[i].num);
            }
            return numbers;
        },
        numbersCol3() {
            let numbers = [];
            for (let i = 2; i < 81; i += 9) {
                numbers.push(this.content[i].num);
            }
            return numbers;
        },
        numbersCol4() {
            let numbers = [];
            for (let i = 3; i < 81; i += 9) {
                numbers.push(this.content[i].num);
            }
            return numbers;
        },
        numbersCol5() {
            let numbers = [];
            for (let i = 4; i < 81; i += 9) {
                numbers.push(this.content[i].num);
            }
            return numbers;
        },
        numbersCol6() {
            let numbers = [];
            for (let i = 5; i < 81; i += 9) {
                numbers.push(this.content[i].num);
            }
            return numbers;
        },
        numbersCol7() {
            let numbers = [];
            for (let i = 6; i < 81; i += 9) {
                numbers.push(this.content[i].num);
            }
            return numbers;
        },
        numbersCol8() {
            let numbers = [];
            for (let i = 7; i < 81; i += 9) {
                numbers.push(this.content[i].num);
            }
            return numbers;
        },
        numbersCol9() {
            let numbers = [];
            for (let i = 8; i < 81; i += 9) {
                numbers.push(this.content[i].num);
            }
            return numbers;
        },
        numbersSq1() {
            return this.numbersRow1
                .slice(0, 3)
                .concat(this.numbersRow2.slice(0, 3))
                .concat(this.numbersRow3.slice(0, 3));
        },
        numbersSq2() {
            return this.numbersRow1
                .slice(3, 6)
                .concat(this.numbersRow2.slice(3, 6))
                .concat(this.numbersRow3.slice(3, 6));
        },
        numbersSq3() {
            return this.numbersRow1
                .slice(6, 9)
                .concat(this.numbersRow2.slice(6, 9))
                .concat(this.numbersRow3.slice(6, 9));
        },
        numbersSq4() {
            return this.numbersRow4
                .slice(0, 3)
                .concat(this.numbersRow5.slice(0, 3))
                .concat(this.numbersRow6.slice(0, 3));
        },
        numbersSq5() {
            return this.numbersRow4
                .slice(3, 6)
                .concat(this.numbersRow5.slice(3, 6))
                .concat(this.numbersRow6.slice(3, 6));
        },
        numbersSq6() {
            return this.numbersRow4
                .slice(6, 9)
                .concat(this.numbersRow5.slice(6, 9))
                .concat(this.numbersRow6.slice(6, 9));
        },
        numbersSq7() {
            return this.numbersRow7
                .slice(0, 3)
                .concat(this.numbersRow8.slice(0, 3))
                .concat(this.numbersRow9.slice(0, 3));
        },
        numbersSq8() {
            return this.numbersRow7
                .slice(3, 6)
                .concat(this.numbersRow8.slice(3, 6))
                .concat(this.numbersRow9.slice(3, 6));
        },
        numbersSq9() {
            return this.numbersRow7
                .slice(6, 9)
                .concat(this.numbersRow8.slice(6, 9))
                .concat(this.numbersRow9.slice(6, 9));
        },
        numbersArr() {
            let arr = [];
            for (let i = 1; i < 10; i++) {
                arr.push(this[`numbersRow${i}`]);
            }
            for (let i = 1; i < 10; i++) {
                arr.push(this[`numbersCol${i}`]);
            }
            for (let i = 1; i < 10; i++) {
                arr.push(this[`numbersSq${i}`]);
            }
            return arr;
        },
    },
    data() {
        return {
            dialog: false,
            chooseLevel: "Any",
            msg: "",
            show: true,
            level: "",
            content: [],
            number: null,
            data: [],
        };
    },
};
</script>

<style lang="scss" scoped>
#plate {
    border: black 0.1vw solid;
    width: 50vw;
    height: 50vw;
}

.btn {
    width: 5.53vw;
    height: 5.53vw;
    border: 0.05vw #f5f5f5 solid;
    position: relative;
    font-size: 3vw;
}

@each $number in 18,
19,
20,
21,
22,
23,
24,
25,
26,
45,
46,
47,
48,
49,
50,
51,
52,
53 {
    #btn#{$number} {
        border-bottom-color: black;
    }
}

@each $number in 2,
11,
20,
29,
38,
47,
56,
65,
74,
5,
14,
23,
32,
41,
50,
59,
68,
77 {
    #btn#{$number} {
        border-right-color: black;
    }
}

@media only screen and (max-width: 600px) {
    #plate {
        border: black 0.1vw solid;
        width: 80vw;
        height: 80vw;
    }

    .btn {
        width: 8.86vw;
        height: 8.86vw;
        border: 0.05vw #f5f5f5 solid;
        position: relative;
        font-size: 3.5vw;
    }
}

@media only screen and (max-width: 445px) {
    #plate {
        border: black 0.1vw solid;
        width: 95vw;
        height: 86.8vw;
    }

    .btn {
        width: 9.58vw;
        height: 9.58vw;
        border: 0.05vw #f5f5f5 solid;
        position: relative;
        font-size: 5vw;
    }
}
</style>
