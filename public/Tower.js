class Tower {
    static COST = 100;
    static IMAGE = document.getElementById('towerImage');

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.damage = 10;
        this.cooldown = 0;
        this.cooldownTime = 30;
        this.width = GRID_SIZE;  // 假設我們想讓塔的寬度與網格大小相同
        this.height = GRID_SIZE; // 高度也與網格大小相同
    }

    draw(ctx) {
        // 使用圖片繪製塔
        ctx.drawImage(Tower.IMAGE, 
            this.x * GRID_SIZE, 
            this.y * GRID_SIZE, 
            this.width, 
            this.height);
        
        // 可選:繪製範圍圈
        ctx.beginPath();
        ctx.arc(this.x * GRID_SIZE + this.width/2, this.y * GRID_SIZE + this.height/2, this.range, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.2)';
        ctx.stroke();
    }

    shoot(enemies, projectiles) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        for (let enemy of enemies) {
            const distance = Math.sqrt(
                (this.x * GRID_SIZE + GRID_SIZE / 2 - enemy.x) ** 2 + 
                (this.y * GRID_SIZE + GRID_SIZE / 2 - enemy.y) ** 2
            );
            
            if (distance <= this.range) {
                const projectile = new Projectile(
                    this.x * GRID_SIZE + GRID_SIZE / 2,
                    this.y * GRID_SIZE + GRID_SIZE / 2,
                    enemy,
                    5
                );
                projectiles.push(projectile);
                this.cooldown = this.cooldownTime;
                break;
            }
        }
    }
}