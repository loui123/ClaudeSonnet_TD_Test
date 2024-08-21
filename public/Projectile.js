class Projectile {
    constructor(x, y, targetEnemy, speed) {
        this.x = x;
        this.y = y;
        this.targetEnemy = targetEnemy;
        this.speed = speed;
        this.radius = 5;
    }

    move() {
        if (!this.targetEnemy) return;

        const predictedX = this.targetEnemy.x + this.targetEnemy.speed * Math.cos(this.targetEnemy.angle);
        const predictedY = this.targetEnemy.y + this.targetEnemy.speed * Math.sin(this.targetEnemy.angle);

        const dx = predictedX - this.x;
        const dy = predictedY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.speed) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            this.x = this.targetEnemy.x;
            this.y = this.targetEnemy.y;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    hasHitTarget() {
        if (!this.targetEnemy) return false;
        const dx = this.x - this.targetEnemy.x;
        const dy = this.y - this.targetEnemy.y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius + this.targetEnemy.radius;
    }
}