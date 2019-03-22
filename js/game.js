canvas = document.querySelector('#game')
ctx = canvas.getContext('2d')

let snake = {
    score: 0,
    speed: 4,
    fps: 200, 
    color: 'green',
    cellSide: 10,
    food: undefined,
    turnPoints:[],
    tail:[
        {
            x: Math.floor(canvas.width/2),
            y: 30,
            dx: 0,
            dy: 1,
            turns:[],
            color: `green`
        }             
    ]
}

function isFood(){
    if(snake.food != undefined){
        ctx.beginPath()
        ctx.rect(snake.food.x,snake.food.y,snake.cellSide,snake.cellSide)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.closePath()
        if(snake.tail[0].x == snake.food.x && snake.tail[0].y == snake.food.y){
            snake.score += 10
            let x = Math.floor(Math.random()*canvas.width/10)*10
            let y = Math.floor(Math.random()*canvas.height/10)*10
            snake.food = {x:x, y:y}
            addCell()
            ctx.beginPath()
            ctx.rect(x,y,snake.cellSide,snake.cellSide)
            ctx.fillStyle = 'red'
            ctx.fill()
            ctx.closePath()
        }
    }else{
        snake.food = {x:Math.floor(Math.random()*canvas.width/10)*10, y:Math.floor(Math.random()*canvas.height/10)*10}
        isFood()     
    }
}

function drawSnake(){
    snake.tail.forEach((cell)=>{
        ctx.beginPath()
        ctx.rect(cell.x,cell.y,snake.cellSide,snake.cellSide)
        ctx.fillStyle = cell.color
        ctx.fill()
        ctx.closePath()
    })
}

function turnCollisions(){
    snake.tail.forEach((cell)=>{
        snake.turnPoints.forEach((turnPoint, index)=>{
            if(cell.x == turnPoint.x && cell.y == turnPoint.y && cell.turns.indexOf(index) == -1){
                cell.dx = turnPoint.dx
                cell.dy = turnPoint.dy
                cell.turns.push(index)
            }
        })
    })
}

function drawScore(){
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${snake.score}`,10,50); 
}

function dead(){
    console.log('die')
    alert('You Dead. Score: '+snake.score)
    window.location.reload()
}

function dieCollision(){
    if((snake.tail[0].x < 0) || (snake.tail[0].x > canvas.width) || (snake.tail[0].y < 0) || (snake.tail[0].y > canvas.height)){
        dead()
    }
    snake.tail.forEach((cell,cellIndex)=>{
        if(cellIndex!=0 && cell.x == snake.tail[0].x && cell.y == snake.tail[0].y){
            dead()
        }

    })
}

function addCell(){
    let last = snake.tail[snake.tail.length-1]
    let add = {}
    if(last.dx == 0){
        add = {
            x: last.x,
            y: last.y+snake.cellSide*last.dy*-1,
            dx: last.dx,
            dy:last.dy,
            turns:[...last.turns],
            color: `green`
        }
    }else if(last.dy == 0){
        add = {
            x: last.x+snake.cellSide*last.dx*-1,
            y: last.y,
            dx: last.dx,
            dy:last.dy,
            turns:[...last.turns],
            color:  `green`
        }            
    }
    snake.tail.push(add)
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    dieCollision()
    drawSnake()
    isFood()
    drawScore()
    turnCollisions()
    snake.tail.forEach(cell=>{
        cell.x += snake.cellSide*cell.dx
        cell.y += snake.cellSide*cell.dy
    })
}
document.addEventListener('keyup',function(event){
    if(event.keyCode == 32){
        snake.fps = 200
        clearInterval(interval)
        interval = setInterval(draw, snake.fps)
    }
})
document.addEventListener('keydown', function(event){
    if(event.keyCode == 39 && (snake.tail.length < 2 || snake.tail[0].dx != -1)){
        snake.turnPoints.push({
            x:snake.tail[0].x,
            y:snake.tail[0].y,
            dx:1,
            dy:0,
        })
    }
    if(event.keyCode == 37 && (snake.tail.length < 2  || snake.tail[0].dx != 1)){
        snake.turnPoints.push({
            x:snake.tail[0].x,
            y:snake.tail[0].y,
            dx:-1,
            dy:0,
        })
    }
    if(event.keyCode == 38 && (snake.tail.length < 2 || snake.tail[0].dy != 1)){
        snake.turnPoints.push({
            x:snake.tail[0].x,
            y:snake.tail[0].y,
            dx:0,
            dy:-1,
        })
    }
    if(event.keyCode == 40 && (snake.tail.length< 2 || snake.tail[0].dy != -1)){
        snake.turnPoints.push({
            x:snake.tail[0].x,
            y:snake.tail[0].y,
            dx:0,
            dy:1,
        })
    }
    if(event.keyCode == 32){
        if(snake.fps != 60){
            snake.fps = 60
            clearInterval(interval)
            interval = setInterval(draw, snake.fps)
        }
    }
    if(event.keyCode == 20){
        addCell()
    }
})
let interval =  setInterval(draw, snake.fps)