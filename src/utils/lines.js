export default function linesCross(x1, y1, x2, y2, u1, v1, u2, v2) {
    // formula for line: y= a+bx

    let result = {};

    // vertical lines result in a divide by 0;
    let line1Vertical = x2 === x1;
    let line2Vertical = u2 === u1;
    if (line1Vertical && line2Vertical) {
        // x=a
        if (x1 === u1) {
            // lines are the same
            return (y1 <= v1 && v1 < y2) || (y1 <= v2 && v2 < y2);
        } else {
            // parallel -> they don't intersect!
            return false;
        }
    } else if (line1Vertical && !line2Vertical) {
        let b2 = (v2 - v1) / (u2 - u1);
        let a2 = v1 - b2 * u1;

        let yi = a2 + b2 * x1;

        return yi >= y1 && yi <= y2;
    } else if (!line1Vertical && line2Vertical) {
        let b1 = (y2 - y1) / (x2 - x1);
        let a1 = y1 - b1 * x1;

        let yi = a1 + b1 * u1;

        return yi >= v1 && yi <= v2;
    } else {
        let b1 = (y2 - y1) / (x2 - x1);
        // divide by zero if second line vertical
        let b2 = (v2 - v1) / (u2 - u1);

        let a1 = y1 - b1 * x1;
        let a2 = v1 - b2 * u1;

        if (b1 - b2 === 0) {
            if (a1 === a2) {
                // lines are the same
                return (x1 <= u1 && u1 < x2) || (x1 <= u2 && u2 < x2);
            } else {
                // parallel -> they don't intersect!
                return false;
            }
        }
        // calculate intersection point xi,yi
        let xi = -(a1 - a2) / (b1 - b2);
        let yi = a1 + b1 * xi;

        result.x = xi;
        result.y = yi;

        result.cross = (x1 - xi) * (xi - x2) >= 0 &&
            (u1 - xi) * (xi - u2) >= 0 &&
            (y1 - yi) * (yi - y2) >= 0 &&
            (v1 - yi) * (yi - v2) >= 0;

        return result;
    }
}
