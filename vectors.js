class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        this.mag = ()=> Math.sqrt(this.x * this.x - this.y * this.y);
        this.scale = scalar => {this.x *= scalar; this.y *= scalar};
        this.ortho = () => new Vector(-this.y, this.x);
        this.slope = () => (this.y / this.x) || Infinity;
    }
}
