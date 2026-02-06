class Camera {
    constructor(worldWidth, worldHeight) {
        this.x = 0;
        this.y = 0;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.smoothing = 0.1;
    }

    follow(target) {
        let targetX = target.pos.x;
        let targetY = target.pos.y;

        this.x = lerp(this.x, targetX, this.smoothing);
        this.y = lerp(this.y, targetY, this.smoothing);

        this.x = constrain(this.x, width / 2, this.worldWidth - width / 2);
        this.y = constrain(this.y, height / 2, this.worldHeight - height / 2);
    }

    apply() {
        translate(-this.x + width / 2, -this.y + height / 2);
    }

    getScreenPos(worldPos) {
        return createVector(
            worldPos.x - this.x + width / 2,
            worldPos.y - this.y + height / 2
        );
    }

    getWorldPos(screenPos) {
        return createVector(
            screenPos.x + this.x - width / 2,
            screenPos.y + this.y - height / 2
        );
    }

    isOnScreen(pos, margin = 100) {
        let screenPos = this.getScreenPos(pos);
        return screenPos.x > -margin &&
            screenPos.x < width + margin &&
            screenPos.y > -margin &&
            screenPos.y < height + margin;
    }
}
