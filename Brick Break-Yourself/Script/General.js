/// <reference path="jquery-1.7.2.min.js" />
/// <reference path="jquery-ui-1.8.22.custom.min.js" />


$(document).ready(function () {

    var ctx;


    var xpos = 200;
    var ypos = 200;
    var xspeed = 2;
    var yspeed = 4;
    var circCol = "#E0145C";
    var circSize = 8;

    var canWidth = $("#main").width();
    var canHeight = $("#main").height();


    //paddle variables
    var paddleX;
    var paddleH = 10;
    var paddleW = 60;
    var paddleSpeed = 5;
    var paddleCol = "#000000";

    //keyboard
    var rightDown = false;
    var leftDown = false;

    //bricks
    var bricks;
    var brrows;
    var brcolumns;
    var brheight;
    var brwidth;
    var padding;
    var brcolors = ["#31CC46", "#15418C", "#7C8532", "#B04F3C", "#6EF0E7"];


    //scoring
    var score = 0;
    var scoreMultiplier = 3;
    var finalscore = 0;
    var timelimit = 60;
    var counter = setInterval(timer, 1000);


    //checks if left or right is pressed, if so, sets their 'Down' values to true
    function onKeyDown(evt) {
        if (evt.keyCode == 39) {
            rightDown = true;
        }
        else if (evt.keyCode == 37) {
            leftDown = true;
        }
    }

    //sets them back to false
    function onKeyUp(evt) {
        if (evt.keyCode == 39) {
            rightDown = false;
            
        }
        else if (evt.keyCode == 37) {
            leftDown = false;
        }
    }

    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);


    function initbricks() {
        brrows = 5;
        brcolumns = 6;
        brwidth = (canWidth / brcolumns) - 1;
        brheight = 20;
        padding = 2;

        //brick array
        bricks = new Array(brrows);
        for (i = 0; i < brrows; i++) {
            bricks[i] = new Array(brcolumns);
            for (n = 0; n < brcolumns; n++) {
                bricks[i][n] = 1;
            }
        }
    }

    function initialize() {
        ctx = $('#canvas')[0].getContext("2d");
        intervalId = setInterval(draw, 15);

        paddleX = canWidth / 2;
        return intervalId;
    }

    function circle(x, y, rad, col) { //draw circle function

        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function rectangle(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }

    function scoring(score, multiplier, timer) {
    
        if (timer < 50 && score < 3) {
            score += score * multiplier;
        }
        finalscore = score;
    }


    //timer
    function timer(score, multiplier) {
        timelimit = timelimit - 1;

        if (timelimit <= 0) {
            clearInterval(counter);
            
            clearInterval(intervalId);//timer runs out
            return;
        }

        $("#timer").html("Time Limit: " + timelimit);
        $("#score").html("Score: " + finalscore);
    }

    function clear() {
        ctx.clearRect(0, 0, canWidth, canHeight);
    }


//--------------------------------------------End Library
    

    function draw() {
        
        clear();

        circle(xpos, ypos, circSize, circCol);

        //paddle movement
        if (rightDown == true) {
            if (paddleX < canWidth - paddleW) {
                paddleX += paddleSpeed;
            }
        }
        else if (leftDown == true) {
            if (paddleX > 0) {
                paddleX -= paddleSpeed;
            }
        }
        
        //paddle draw
        ctx.fillStyle = paddleCol;
        rectangle(paddleX, canHeight - paddleH, paddleW, paddleH);

        //draw bricks
        for (i = 0; i < brrows; i++) {
            ctx.fillStyle = brcolors[i];
            for (n = 0; n < brcolumns; n++) {
                if (bricks[i][n] == 1) {
                    rectangle((n * (brwidth + padding)) + padding,
                              (i * (brheight + padding)) + padding,
                              brwidth, brheight);
                }
            }
        }

        //brick hits
        rowheight = brheight + padding;
        colwidth = brwidth + padding;
        row = Math.floor(ypos / rowheight);
        col = Math.floor(xpos / colwidth);

        //if hit
        if(ypos < brrows * rowheight && row >= 0 && col >= 0 && bricks[row][col] ==1) {
            yspeed = -yspeed;
            bricks[row][col] = 0;
            score += 1;

            //angle hits on bricks
            var pad_x = xpos - paddleX;
            if (pad_x > paddleW / 2) {
                pad_x = (pad_x % 5);
            }
            else {
                pad_x = (pad_x - paddleW / 2) % 5;
            }
            xspeed = (xspeed > 0) ? -pad_x : pad_x;
        }


        if (xpos + xspeed > canWidth || xpos + xspeed < 0) {  //bounce off walls
            xspeed = -xspeed;
        }
        if (ypos + yspeed < 0) {
            yspeed = -yspeed;
        }
        else if (ypos + yspeed > canHeight) {
            if (xpos > paddleX && xpos < paddleX + paddleW) {
                yspeed = -yspeed;
            }
            else {
                clearInterval(intervalId);
            }
        }


        xpos += xspeed;
        ypos += yspeed;

    }

    initialize();
    initbricks();
    scoring(score, scoreMultiplier, timelimit);
    timer(score,scoreMultiplier);
   

})