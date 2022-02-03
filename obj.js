var circles = { //x, y
    cmicro: [[1, 0], [0, 1],  [2, 1], [1, 2]],
    csmall: [[1, 0], [2, 0],  [0, 1], [3, 1],
             [0, 2], [3, 2],  [1, 3], [2, 3]],
    cbig:   [[2, 0], [3, 0],  [1, 1], [4, 1], 
             [0, 2], [5, 2],  [0, 3], [5, 3], 
             [1, 4], [4, 4],  [2, 5], [3, 5]]
}
var boxes = {
    bmicro: [[0, 0], [0, 1],  [1, 0], [1, 1]],
    bsmall: [[0, 0], [1, 0], [2, 0],  [0, 1],
             [2, 1],  [0, 2], [1, 2], [2, 2]],
    bbig:   [[0, 0], [1, 0], [2, 0], [3, 0], 
             [4, 0], [5, 0],  [0, 1], [4, 1],
             [0, 2], [4, 2], [0, 3], [4, 3],
             [0, 4], [1, 4], [2, 4], [3, 4], 
             [4, 4], [5, 4]]
}

module.exports = {
    circles: circles,
    boxes: boxes
}