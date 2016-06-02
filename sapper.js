function newGame(cmplxty) {
    gtable = new gtable(6, 6);
    gtable.render();
    gtable.gameOver = false;

    $('.cell').click(function (eventObject) {
        gtable.click(eventObject.target);
    });

    return gtable;
}
function gtable(field, column){
    this.field= field;
    this.column = column;   
    this.cells = [];    
    this.gameOver = false;
    this.cellsCleared = 0;
    this.bombCount = 0;

    this.click = function (target_elem) {
        var field= $(target_elem).attr("dt-field");
        var column = $(target_elem).attr("dt-column");


        if (this.gameOver === true) {
            return;
        }

        if (this.cells[field- 1][column - 1].explored == true) {
            return;
        }

        if (this.cells[field- 1][column - 1].holds == -1) {
            this.explode();
        } else if (this.cells[field- 1][column - 1].holds == 0) {
            this.clear(field- 1, column - 1);
            near.call(this, field- 1, column - 1);
        } else {
            this.clear(field- 1, column - 1);
        }
    }
    this.render = function() {
        var cells = "";
        for (i = 1; i <= field; i++) {
            for (j = 1; j <= column; j++) {
                cells = cells.concat('<div class="cell" dt-field="' + i + '" dt-column="' + j + '">&nbsp;</div>');
            }
            cells = cells.concat('<br />');
        }
        $('#gtable').empty();
        $('#gtable').append(cells);
    }
    this.explode = function() {
        for (i = 0; i < this.field; i++) {
            for (j = 0; j < this.column; j++) {
                if (this.cells[i][j].holds == -1) {
                    var dom_target = 'div[dt-field="' + (i + 1) + '"][dt-column="' + (j + 1) + '"]';
                    $(dom_target).addClass('bomb');
                    $(dom_target).html('<i class="fa fa-bomb"></i>');
                }
            }
        }
        this.gameOver = true;
        $('#new-game').show();
    }
    var btoomAround = function(field, column) {
        var sum = 0;

        if (this.cells[field][column].holds == -1) {
            return -1;
        }

        sum += valueAt.call(this, field- 1, column - 1) + valueAt.call(this, field- 1, column) + valueAt.call(this, field- 1, column + 1) 
            + valueAt.call(this, field, column - 1) + valueAt.call(this, field, column + 1) 
            + valueAt.call(this, field+ 1, column - 1) + valueAt.call(this, field+ 1, column) + valueAt.call(this, field+ 1, column + 1);

        return sum;
    }
    function valueAt(field, column) {
        if (field< 0 || field>= this.field|| column < 0 || column >= this.column) {
            return 0;
        } else if(this.cells[field][column].holds == -1){
            return 1;
        } else {
            return 0;
        }
    }
    if (this.cells !== undefined) {
        this.cells = new Array(this.field);

        for (i = 0; i < this.field; i++) {
            this.cells[i] = new Array(this.column);
            for (j = 0; j < this.column; j++) {
                this.cells[i][j] = new cell(false, 0);
            }
        }
        var min = 1;
        var max = this.field* this.column;
        $('#value').html(8);
        for (i = 0; i < 8; i++) {
            var bombIndex = Math.round(Math.random() * (max - 1));
            var x = Math.floor(bombIndex / this.column);
            var y = bombIndex % this.column;
            this.cells[x][y] = new cell(false, -1);
        }
        for (i = 0; i < this.field; i++) {
            for (j = 0; j < this.column; j++) {
                this.cells[i][j].holds = btoomAround.call(this, i, j);
            }
        }
    }
    this.clear = function (field, column) {
        var dom_target = 'div[dt-field="' + (field+ 1) + '"][dt-column="' + (column + 1) + '"]';
        $(dom_target).addClass('safe');
        if (this.cells[field][column].holds > 0) {
            $(dom_target).text(this.cells[field][column].holds);
        } else {
            $(dom_target).html('&nbsp');
        }
        checkAllCellsExplored.call(this);
        this.cellsCleared++;
        this.cells[field][column].explored = true;
    }
    function checkAllCellsExplored(){
        if (this.field* this.column - this.cellsCleared == this.bombCount) {
            for (i = 0; i < this.field; i++) {
                for (j = 0; j < this.column; j++) {
                    if (this.cells[i][j].holds == -1) {
                        var bomb_target = 'div[dt-field="' + (i + 1) + '"][dt-column="' + (j + 1) + '"]';
                        $(bomb_target).html('<i class="fa fa-joke-o"></i>');
                        this.gameOver = true;
                        $('#new-game').show();
                    }
                }
            }
        }
    }
    function near(field, column) {
        checkAllCellsExplored.call(this);
        examThem.call(this, field, column - 1); examThem.call(this, field, column + 1);
        examThem.call(this, field+ 1, column - 1); examThem.call(this, field+ 1, column); examThem.call(this, field+ 1, column + 1);
		examThem.call(this, field- 1, column - 1); examThem.call(this, field- 1, column); examThem.call(this, field- 1, column + 1);
    }
    function examThem(field, column) {
        if (field< 0 || field>= this.field|| column < 0 || column >= this.column || this.cells[field][column].explored == true) {
            return;
        } else if (this.cells[field][column].holds >= 0) {
            this.clear(field, column);
            if (this.cells[field][column].holds == 0) {
                near.call(this, field, column);
                return;
            }
        }
    }
}
function cell(explored, holds){
    this.explored = explored;
    this.holds = holds;
}