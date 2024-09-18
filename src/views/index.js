export function getNodeMap(root) {
    const result = {}
    let arryResult = []
    if(!root.childNode) {
        return result
    }
    const stack = [root.childNode]
    while (stack.length) {
        const node = stack.shift()
        const { childNode = null, conditionNodes = [] } = node
        if(!result[node.nodeId]) {
            result[node.nodeId] = node
        }
        arryResult.push(node)
        if(childNode) {
            stack.push(childNode)
        }
        stack.push(...conditionNodes)
    }
    const firstNode = root.childNode

    const g = new Graph(result)
    console.log('arryResult', arryResult)
    return result
}

export function getRootFromResult(result) {
}

export class Graph {
    constructor(vertices) {
        this.vertices = []
        this.adjMat = []

        for(const val in vertices) {
            this.addVertex(val)
        }
    }

    size() {
        return this.vertices.length
    }

    addVertex(val) {
        const n = this.size()
        this.vertices.push(val)
        const newRow = new Array(n).fill(0)
        this.adjMat.push(newRow)
        for(const row of this.adjMat) {
            row.push(0)
        }
    }
}
