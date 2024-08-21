class Enemy {
    constructor(baseHealth, baseSpeed) {
        this.x = 0;
        this.y = GRID_SIZE / 2;
        this.speed = baseSpeed;
        this.health = baseHealth;
        this.maxHealth = baseHealth;
        this.pathIndex = 0;
        this.radius = 10;
        this.angle = 0;
    }

    move() {
        const path = this.getPath();
        if (this.pathIndex < path.length) {
            const [targetX, targetY] = path[this.pathIndex];
            const dx = targetX * GRID_SIZE - this.x;
            const dy = targetY * GRID_SIZE - this.y;
            
            this.angle = Math.atan2(dy, dx);

            if (Math.abs(dx) < this.speed && Math.abs(dy) < this.speed) {
                this.pathIndex++;
            } else {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
            }
        }
    }

    getPath() {
        const path = [];
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (terrain[row][col] === 1) {
                    path.push([col, row]);
                }
            }
        }
        return path;
    }

    draw(ctx) {
        // 繪製敵人
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 繪製血條
        ctx.fillStyle = 'lightgreen';
        ctx.fillRect(this.x - 15, this.y - 20, 30 * (this.health / this.maxHealth), 5);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x - 15, this.y - 20, 30, 5);
    }

    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
}