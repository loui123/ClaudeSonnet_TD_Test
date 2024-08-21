const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const talentCanvas = document.getElementById('talentCanvas');
const talentTree = new TalentTree(talentCanvas);

let enemies = [];
let towers = [];
let projectiles = [];
let explosions = [];
let playerHealth = 100;
let score = 0;
let gold = 100;

let currentWave = 0;
const totalWaves = 15;
let enemiesInWave = 0;
let enemiesSpawned = 0;
let baseEnemyHealth = 5;
let baseEnemySpeed = 1;

window.onload = function() {
    if (Tower.IMAGE.complete) {
        startGame();
    } else {
        Tower.IMAGE.onload = startGame;
    }
	talentTree.draw();
}

function startGame() {
	talentTree.applyTalents(); // 應用保存的天賦效果
    talentTree.draw(); // 重繪天賦樹
    startNextWave();
    gameLoop();
}

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = 20;
        this.speed = 1;
    }

    update() {
        this.radius += this.speed;
        return this.radius <= this.maxRadius;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 100, 0, ' + (1 - this.radius / this.maxRadius) + ')';
        ctx.fill();
    }
}

function spawnEnemy() {
    if (enemiesSpawned < enemiesInWave) {
        enemies.push(new Enemy(baseEnemyHealth, baseEnemySpeed));
        enemiesSpawned++;
        setTimeout(spawnEnemy, 1000); // 每秒生成一個敵人
    }
}

function startNextWave() {
    currentWave++;
    if (currentWave <= totalWaves) {
        enemiesInWave = Math.floor(Math.random() * 16) + 15; // 15-30 敵人
        enemiesSpawned = 0;
        baseEnemyHealth += Math.floor(Math.random() * 7) + 2; // 增加2-8生命
        baseEnemySpeed *= (1 + (Math.random() * 0.08 + 0.02)); // 增加2%-10%速度
        spawnEnemy();
        if(currentWave !== 1)talentTree.addTalentPoint();
        talentTree.draw();
    }
}

function spawnTower(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / GRID_SIZE);
    const y = Math.floor((event.clientY - rect.top) / GRID_SIZE);
    
    if (terrain[y][x] === 0 && !towers.some(t => t.x === x && t.y === y) && gold >= Tower.COST) {
        towers.push(new Tower(x, y));
        gold -= Tower.COST;  // 扣除塔的成本
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTerrain(ctx);

    enemies = enemies.filter(enemy => {
        enemy.move();
        enemy.draw(ctx);

        if (enemy.pathIndex >= enemy.getPath().length) {
            playerHealth -= 10;
            return false;
        }
        return true;
    });

    towers.forEach(tower => {
        tower.draw(ctx);
        tower.shoot(enemies, projectiles);
    });

    projectiles = projectiles.filter(projectile => {
        projectile.move();
        projectile.draw(ctx);

        if (projectile.hasHitTarget()) {
            const hitEnemy = projectile.targetEnemy;
            if (hitEnemy && hitEnemy.takeDamage(10)) { // 敵人受到傷害
                explosions.push(new Explosion(hitEnemy.x, hitEnemy.y));
                const index = enemies.indexOf(hitEnemy);
                if (index > -1) {
                    enemies.splice(index, 1);
                    score += 10;
					gold += Math.floor((Math.random() * 5 + 1) * talentTree.goldMultiplier);
                }
            }
            return false;
        }
        return true;
    });

    explosions = explosions.filter(explosion => {
        const shouldContinue = explosion.update();
        explosion.draw(ctx);
        return shouldContinue;
    });

    // 檢查是否需要開始下一波
    if (enemies.length === 0 && enemiesSpawned === enemiesInWave) {
        if (currentWave < totalWaves) {
            startNextWave();
        }
    }

    // 更新UI
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`生命值: ${playerHealth}`, 10, 20);
    ctx.fillText(`分數: ${score}`, 10, 40);
    ctx.textAlign = 'right';
    ctx.fillText(`Gold: ${gold}`, canvas.width - 10, 20);
    ctx.fillText(`Wave: ${currentWave}/${totalWaves}`, canvas.width - 10, 40);
    ctx.textAlign = 'left';

    if (playerHealth <= 0) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('遊戲結束', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'left';
        return;
    }

    requestAnimationFrame(gameLoop);
}
talentCanvas.addEventListener('click', (event) => {
    const rect = talentCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    talentTree.handleClick(x, y);
    talentTree.applyTalents();
});

document.getElementById('resetTalentsButton').addEventListener('click', () => {
    talentTree.reset();
    // 重置遊戲相關的數值
    Tower.prototype.damage = 10; // 假設這是初始傷害
    Tower.prototype.cooldownTime = 30; // 假設這是初始冷卻時間
    talentTree.goldMultiplier = 1;
});
canvas.addEventListener('click', spawnTower);