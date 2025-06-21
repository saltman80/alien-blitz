function validateBoundingBox(box, name) {
    if (typeof box !== 'object' || box === null) {
        throw new TypeError(`${name} must be a non-null object`);
    }
    const props = ['x','x2','y','y2'];
    for (const prop of props) {
        if (!(prop in box)) {
            throw new TypeError(`${name} is missing property '${prop}'`);
        }
        const v = box[prop];
        if (typeof v !== 'number' || Number.isNaN(v)) {
            throw new TypeError(`${name}.${prop} must be a valid number`);
        }
    }
    if (box.x > box.x2) {
        throw new RangeError(`${name}.x (${box.x}) must be <= ${name}.x2 (${box.x2})`);
    }
    if (box.y > box.y2) {
        throw new RangeError(`${name}.y (${box.y}) must be <= ${name}.y2 (${box.y2})`);
    }
}

/**
 * Determines whether two axis-aligned bounding boxes overlap.
 *
 * Coordinate system: origin (0,0) at top-left, x increases to the right, y increases downward.
 *
 * Touching edges or corners are considered a collision (overlap).
 *
 * @param {BoundingBox} a - First bounding box.
 * @param {BoundingBox} b - Second bounding box.
 * @returns {boolean} True if boxes overlap or touch; false otherwise.
 * @throws {TypeError|RangeError} If inputs are invalid bounding boxes.
 */
export function collides(a, b) {
    validateBoundingBox(a, 'a');
    validateBoundingBox(b, 'b');

    // No overlap if one is entirely to one side of the other.
    return !(
        a.x > b.x2 ||    // a is entirely to the right of b
        a.x2 < b.x ||    // a is entirely to the left of b
        a.y > b.y2 ||    // a is entirely below b
        a.y2 < b.y       // a is entirely above b
    );
}