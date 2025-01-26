(function() {
    class SnakeGame extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = `
                <style>
                    .wrapper {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .controls {
                        display: flex;
                        gap: 20px;
                        margin: 10px;
                    }
                    .score {
                        color: #fff;
                        font-family: Arial;
                    }
                    button {
                        padding: 5px;
                        background: #444;
                        color: #fff;
                        border: 1px solid #fff;
                        cursor: pointer;
                    }
                    canvas {
                        border: 2px solid #fff;
                        background: #000;
                    }
                </style>
                <div class="wrapper">
                    <div class="controls">
                        <div class="score">Score: <span id="s">0</span></div>
                        <button onclick="alert('Arrow keys to move\\nEat red food\\nDont hit walls/self')">How to play</button>
                    </div>
                    <canvas id="g" width="400" height="400"></canvas>
                </div>
            `;

            let context = this.shadowRoot.getElementById('g').getContext('2d'),
                scoreElement = this.shadowRoot.getElementById('s'),
                snake = [{x:200, y:200}],
                food = {x:0, y:0},
                directionX = 0,
                directionY = 0,
                score = 0,
                gameOver = 0,
                gameStarted = 0;

            const randomizeFood = () => {
                food.x = Math.floor(Math.random() * 20) * 20;
                food.y = Math.floor(Math.random() * 20) * 20;
            }

            const drawSquare = (x, y, color) => {
                context.fillStyle = color;
                context.fillRect(x, y, 18, 18);
            }

            const drawText = (text, y, size) => {
                context.font = size + 'px Arial';
                let measure = context.measureText(text);
                context.fillText(text, (400 - measure.width) / 2, y);
            }

            const draw = () => {
                context.fillStyle = '#000';
                context.fillRect(0, 0, 400, 400);

                snake.forEach((segment, index) =>
                    drawSquare(segment.x, segment.y, index ? '#090' : '#0f0')
                );

                drawSquare(food.x, food.y, '#f00');

                if(gameOver) {
                    context.fillStyle = '#fff';
                    drawText('game over', 180, 30);
                    drawText('score: ' + score, 220, 30);
                    drawText('space to restart', 260, 20);
                }
            }

            const update = () => {
                if(gameOver || !gameStarted) return;

                let head = {
                    x: snake[0].x + directionX,
                    y: snake[0].y + directionY
                };

                if(head.x < 0 || head.x > 380 || head.y < 0 || head.y > 380) {
                    gameOver = 1;
                    return;
                }

                snake.unshift(head);

                if(head.x == food.x && head.y == food.y) {
                    score += 10;
                    scoreElement.textContent = score;
                    randomizeFood();
                } else {
                    snake.pop();
                }

                for(let i = 1; i < snake.length; i++) {
                    if(head.x == snake[i].x && head.y == snake[i].y) gameOver = 1;
                }
            }

            const resetGame = () => {
                snake = [{x:200, y:200}];
                directionX = directionY = score = gameOver = 0;
                gameStarted = 0;
                scoreElement.textContent = 0;
                randomizeFood();
            }

            document.addEventListener('keydown', event => {
                if(event.code == 'Space' && gameOver) {
                    resetGame();
                    return;
                }

                let validMove = 0;

                switch(event.key) {
                    case 'ArrowUp':
                        if(directionY == 0) {
                            directionX = 0;
                            directionY = -20;
                            validMove = 1;
                        }
                        break;
                    case 'ArrowDown':
                        if(directionY == 0) {
                            directionX = 0;
                            directionY = 20;
                            validMove = 1;
                        }
                        break;
                    case 'ArrowLeft':
                        if(directionX == 0) {
                            directionX = -20;
                            directionY = 0;
                            validMove = 1;
                        }
                        break;
                    case 'ArrowRight':
                        if(directionX == 0) {
                            directionX = 20;
                            directionY = 0;
                            validMove = 1;
                        }
                }

                if(!gameStarted && validMove) gameStarted = 1;
            });

            randomizeFood();
            setInterval(() => {
                update();
                draw();
            }, 100);
        }
    }

    if (!customElements.get('snake-game')) {
        customElements.define('snake-game', SnakeGame);
    }
})();
