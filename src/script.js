var test = function () {
    var arr = [];
    for (let i = 0; i < 81; i++) {
        arr.push(i.toString());
    }
    for (let n = 0; n < 81; n++) {
        let row, column, square;
        let rowObj = {};
        for (let i = 1; i <= 9; i++) {
            rowObj['row' + i] = arr.slice((i - 1) * 9, i * 9);
        }
        let columnObj = {};
        for (let i = 1; i <= 9; i++) {
            let col = [];
            for (let j = i - 1; j < 81; j += 9) {
                col.push(arr[j]);
            }
            columnObj['column' + i] = col;
        }
        let squareObj = {};
        let sqArr = [];
        let sqInitArr = [0, 1, 2, 9, 10, 11, 18, 19, 20];
        for (let i = 1; i <= 21; i++) {
            let sqr = [];
            for (let j = 0; j < 9; j++) {
                sqr.push(arr[sqInitArr[j] + (i - 1) * 3]);
            }
            sqArr.push(sqr);
        }
        let sqArrFinal = sqArr.slice(0, 3).concat(sqArr.slice(9, 12)).concat(sqArr.slice(18));
        for (let i = 0; i < sqArrFinal.length; i++) {
            squareObj['square' + (i + 1)] = sqArrFinal[i];
        }
        for (let i = 1; i <= 9; i++) {
            if (rowObj['row' + i].indexOf(n.toString()) >= 0) {
                row = rowObj['row' + i];
            }
            if (columnObj['column' + i].indexOf(n.toString()) >= 0) {
                column = columnObj['column' + i];
            }
            if (squareObj['square' + i].indexOf(n.toString()) >= 0) {
                square = squareObj['square' + i];
            }
        }
        let testArr = [];
        for (let i = 1; i <= 9; i++) {
            if (row.indexOf(i) < 0 && column.indexOf(i) < 0 && square.indexOf(i) < 0) {
                testArr.push('yes');
            } else {
                testArr.push('no');
            }
        }
        if (testArr.indexOf('yes') < 0) {
            return;
        } else {
            let number = Math.round(Math.random() * 8) + 1;
            do {
                number = Math.round(Math.random() * 8) + 1;
            } while (row.indexOf(number) >= 0 || column.indexOf(number) >= 0 || square.indexOf(number) >= 0);
            arr[n] = number;
        }
    }
    if (arr[80] != '80') {
        for (let i = 0; i < arr.length; i++) {
            // control levels formed larger harder create
            if (Math.random() < 0.59) {
                arr[i] = 0;
            }
        }
        let sudokuArr = [];
        let zeroArr = [];
        let levels = '';
        arr.forEach((item) => {
            if (item === 0) {
                zeroArr.push(0);
            }
        });
        if (zeroArr.length > 45) {
            levels = 'hard';
        } else if (zeroArr.length > 39) {
            levels = 'medium';
        } else {
            levels = 'easy';
        }
        arr.forEach((item) => {
            if (item === 0) {
                sudokuArr.push({
                    num: '?',
                    color: 'white--text',
                    disable: false
                });
            } else {
                sudokuArr.push({
                    num: item,
                    disable: true
                });
            }
        });
        return [true, sudokuArr, levels]
    }
};

export { test };
