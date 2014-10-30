"use strict";

var EMPTY = 0,
    SNAKE_HEAD = 1,
    SNAKE_BODY = 2,
    FOOD = 3,
    WALL = 4;

var BLOCK_SIZE = 20;

var X = 50,
    Y = 20;

var DT = 100;

var DIR_X = [0, 1, 0, -1];
var DIR_Y = [-1, 0, 1, 0];

var STYLES = {
    0 : {class: "", id: ""},
    1 : {class: "Block Snake", id: "SnakeHead"},
    2 : {class: "Block Snake", id: ""},
    3 : {class: "Block Food", id: ""}
}

var wrapper = null;
var grid = null;

// main
window.onload = function() {
    // get wrapper
    wrapper = document.getElementById("SnakeWrapper");

    // initialize grid
    (function(x, y) {
        grid = [];
        for (var i = 0; i < x; i++) {
            grid.push([]);
            for (var j = 0; j < y; j++) {
                grid[i].push({type: 0, element:null});
            }
        }
    })(X, Y);

    // initialize objects
    var head = {x:Math.floor(X/2), y:Math.floor(Y/2)};
    var direction = 3,
        new_direction = direction;
    var body = [];
    var snakeLength = 0;

    snakeLength = 3;
    addElm(head.x, head.y, SNAKE_HEAD);

    addElm(6, 10, FOOD);

    var keyboardHandler = function (e) {
        var key = e.keyCode;
        console.log(key)
        switch (key) {
            case 37: // Left
                new_direction = 3;
                break;
            case 38: // Up
                new_direction = 0;
                break;
            case 39: // Right
                new_direction = 1;
                break;
            case 40: //Down
                new_direction = 2;
                break;
        }
    }
    
    // Listener
    window.addEventListener("keydown", keyboardHandler, false);

    // main loop
    var siid = setInterval(function () {
        // change direction
        if ((direction+2)%4 !== new_direction) {
            direction = new_direction;
        }
        // move head
        var new_x = head.x + DIR_X[direction];
        var new_y = head.y + DIR_Y[direction];

        if (validPosition(new_x, new_y)) {
        
            var next_pos = getElm(new_x, new_y);
            console.log("Type", next_pos.type);
            if (next_pos.type === FOOD) {
                snakeLength++;
                // while not moving to valid position
                console.log("Init eat");
                while (moveElm(new_x, new_y,
                        Math.floor(Math.random()*X),
                        Math.floor(Math.random()*Y)) === null)
                    console.log("....");
                console.log("Eat");
            }

            var state = moveElm(head.x, head.y, new_x, new_y);
            console.log(state);
            if (state === null) {
                // #TODO
                // end game
                console.log("Invalid state");
                console.log("head", head.x, head.y);
                console.log("New", new_x, new_y);
                console.log(body.length);
                clearInterval(siid);
            }
            
            // move body
            if (snakeLength > body.length) {
                // extend body
                addElm(head.x, head.y, SNAKE_BODY);
                body.push({x:head.x, y:head.y});
            } else {
                // move tail to front
                var last = body.shift();
                moveElm(last.x, last.y, head.x, head.y);
                body.push({x:head.x, y:head.y});
            }

            head.x = new_x;
            head.y = new_y;
        } else {
            console.log("Invalid posiiton");
            clearInterval(siid);
        }
        
    }, DT);
}

var validPosition = function (x, y) {
    if (0 <= x && x < X && 0 <= y && y < Y) {
        return true;
    } else {
        return false;
    }
}

var getElm = function (x, y) {
    return grid[x][y];
}

var addElm = function (x, y, elm_type) {
    if (getElm(x, y).type || !validPosition(x, y))
        return null;

    var elm = document.createElement('div');
    elm.setAttribute('class', STYLES[elm_type]['class']);
    elm.setAttribute('id', STYLES[elm_type]['id']);
    elm.setAttribute('style', 'left:'+BLOCK_SIZE*x+'px; '
                             +'top:' +BLOCK_SIZE*y+'px;');

    grid[x][y].type = elm_type;
    grid[x][y].element = wrapper.appendChild(elm);

    return true;
}

var deleteElm = function (x, y) {
    var element = getElm(x, y);
    if (element.type && validPosition(x, y)) {
        wrapper.removeChild(element.element);
        grid[x][y] = {type: 0, element: null};
        return true;
    } else {
        return null;
    }
}

var moveElm = function (x, y, new_x, new_y) {
    var element = getElm(x, y);
    if (validPosition(x, y) && validPosition(new_x, new_y) &&
        element.type !== 0 && getElm(new_x, new_y).type === 0) {
        // remove old
        wrapper.removeChild(element.element);
        grid[x][y] = {type: 0, element: null};

        // add new
        var elm = element.element;
        elm.setAttribute('style', 'left:'+BLOCK_SIZE*new_x+'px; '
                                      +'top:'+BLOCK_SIZE*new_y+'px;');
        grid[new_x][new_y].type = element.type;
        grid[new_x][new_y].element = wrapper.appendChild(elm);
        return true;
    } else {
        return null;
    }
}
