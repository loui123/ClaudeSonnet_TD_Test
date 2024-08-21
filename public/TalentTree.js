class TalentTree {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
         this.talents = [
            { name: "增加塔傷害", level: 0, maxLevel: 5, effect: (level) => Tower.prototype.damage *= (1 + level * 0.1) },
            { name: "增加塔攻速", level: 0, maxLevel: 5, effect: (level) => Tower.prototype.cooldownTime *= (1 - level * 0.05) },
            { name: "增加金幣獲取", level: 0, maxLevel: 5, effect: (level) => this.goldMultiplier = 1 + level * 0.1 }
        ];
        this.goldMultiplier = 1;
        this.loadTalentState();
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`天賦點數: ${this.talentPoints}`, 10, 20);

        this.talents.forEach((talent, index) => {
            const x = 10 + index * 130;
            const y = 50;
            this.ctx.fillStyle = talent.level > 0 ? 'green' : 'gray';
            this.ctx.fillRect(x, y, 120, 30);
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(`${talent.name} (${talent.level}/${talent.maxLevel})`, x + 5, y + 20);
        });
    }

    handleClick(x, y) {
        if (this.talentPoints > 0) {
            this.talents.forEach((talent, index) => {
                const talentX = 10 + index * 130;
                const talentY = 50;
                if (x >= talentX && x <= talentX + 120 && y >= talentY && y <= talentY + 30) {
                    if (talent.level < talent.maxLevel) {
                        talent.level++;
                        this.talentPoints--;
                        talent.effect(talent.level);
                        this.saveTalentState();
                        this.draw();
                    }
                }
            });
        }
    }

    addTalentPoint() {
        this.talentPoints++;
        this.saveTalentState();
        this.draw();
    }

    reset() {
        this.talents.forEach(talent => {
            while(talent.level > 0) {
                talent.level--;
                this.talentPoints++;
                talent.effect(talent.level);
            }
        });
        this.saveTalentState();
        this.draw();
        this.applyTalents();
    }

    saveTalentState() {
		const talentState = {
            talentPoints: this.talentPoints,
            talentLevels: this.talents.map(t => t.level)
        };
        localStorage.setItem('talentState', JSON.stringify(talentState));
    }

    loadTalentState() {
        const savedState = localStorage.getItem('talentState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.talentPoints = state.talentPoints;
            state.talentLevels.forEach((level, index) => {
                this.talents[index].level = level;
            });
            this.applyTalents();
        }
    }
	
    applyTalents() {
		// 重置所有受天賦影響的數值到初始狀態
        Tower.prototype.damage = 10; // 假設這是初始傷害
        Tower.prototype.cooldownTime = 30; // 假設這是初始冷卻時間
        this.goldMultiplier = 1;

        // 然後應用所有天賦效果
        this.talents.forEach(talent => talent.effect(talent.level));
    }
}