// import { FormatUtils } from '@/utils/formatcommit_data'
// import { NodeUtils } from '@/utils/nodeUtils'
const isEmpty = data => data === null || data === undefined || data === ''
const isEmptyArray = data => Array.isArray(data) ? data.length === 0 : true

export class FormatUtils {

    static param = []

    /**
     * 对基础设置,高级设置等设置页内容进行格式化
     * @param params
     */
    static formatSettings(param) {
        this.param = param
        console.time('格式化用时')
        const formart = (data) => JSON.parse(JSON.stringify(data))
        let treeList = this.flattenMapTreeToList(formart(param)).reverse()
        console.log('格式化第一步', treeList)
        let combinationList = this.getEndpointNodeId(formart(treeList));
        console.log('格式化第二步', combinationList)
        let finalList = this.cleanNodeList(formart(combinationList));
        console.log('格式化第三步', finalList)
        let fomatList = this.adapterActivitiNodeList(formart(finalList));
        console.log('格式化第四步', fomatList)
        console.timeEnd('格式化用时')
        return fomatList;
    }
    /**
    * 展平树结构
    * @param {Object} treeData  - 节点数据 
    * @returns Array - 节点数组
    */
    static flattenMapTreeToList(treeData) {
        let nodeData = [];
        function traverse(node) {
            if (node.nodeType === 2) {
                if (node.childNode) {
                    node.childNode.nodeFrom = node.nodeId;
                    traverse(node.childNode);
                }
                if (!isEmptyArray(node.conditionNodes)) {
                    for (const child of node.conditionNodes) {
                        child.nodeFrom = node.nodeId;
                        traverse(child);
                    }
                    node.nodeTo = node.conditionNodes.map(item => item.nodeId);
                    Reflect.deleteProperty(node, 'conditionNodes')
                }
            }
            else if (node.childNode) {
                node.nodeTo = [node.childNode.nodeId];
                node.childNode.nodeFrom = [node.nodeId];
                traverse(node.childNode);
            }
            Reflect.deleteProperty(node, 'childNode')
            nodeData.push(node);
        }
        traverse(treeData);
        return nodeData;
    }
    /**
     * 递归处理网关节点下属子节点的nodeTo数据
     * @param { Array } parmData -节点关系数组 
     * @returns 
     */
    static getEndpointNodeId(parmData) {

        if (isEmptyArray(parmData)) return parmData;

        let getwayList = parmData.filter((c) => c.nodeType === 2);

        console.log('getwayList', getwayList)

        if (isEmptyArray(getwayList)) return parmData;
        // 构建节点关系链接表{ 节点下有哪些子节点 }
        let nodesGroup = {};
        for (let t of parmData) {
            if (nodesGroup.hasOwnProperty(t.nodeFrom)) {
                nodesGroup[t.nodeFrom].push(t)
            } else {
                nodesGroup[t.nodeFrom] = [t]
            }
        }
        console.log('nodesGroup', nodesGroup)
        for (let getway of getwayList) {
            if (nodesGroup.hasOwnProperty(getway.nodeId)) {
                // 网关节点下的子节点
                let itemNodes = nodesGroup[getway.nodeId];
                // 非条件节点
                let comNode = itemNodes.find((c) => c.nodeType !== 3);
                if (!comNode) continue;
                // 全部条件节点
                let conditionList = itemNodes.filter((c) => c.nodeId !== comNode.nodeId);
                for (let itemNode of conditionList) {
                    function internalTraverse(info) {
                        if (info) {
                            if (!nodesGroup[info.nodeId]) {
                                info.nodeTo = [comNode.nodeId];
                            } else {
                                let tempNode = nodesGroup[info.nodeId];
                                if (Array.isArray(tempNode)) {
                                    for (let t_item of tempNode) {
                                        internalTraverse(t_item);
                                    }
                                }
                                else {
                                    internalTraverse(tempNode);
                                }
                            }
                        }
                    }
                    internalTraverse(itemNode);
                }
            }
        }
        return parmData;
    }
    /**
     * 清理节点数据
     * @param { Array } arr -节点数组
     * @returns 
     */
    static cleanNodeList(arr) {
        let nodeIds = arr.map((c) => { return c.nodeId; });
        for (const node of arr) {
            node.nodeTo = Array.from(new Set(node.nodeTo));
            if (!isEmptyArray(node.nodeTo)) {
                node.nodeTo = node.nodeTo.filter((key) => {
                    return nodeIds.indexOf(key) > -1;
                });
            }
        }
        return arr;
    }

    /**
     * 格式化node数据，对接api接口
     * @param {Array} nodeList 
     * @returns 
     */
    static adapterActivitiNodeList2(nodeList) {
        for (let node of nodeList) {
            if (node.hasOwnProperty('id')) {
                delete node.id;
            }  
            if (node.nodeType == 3) {
                let conditionObj = {
                    conditionList:node.conditionList,
                    sort: node.priorityLevel,
                    isDefault: node.isDefault
                }; 
                Object.assign(node, { property: {} });
                node.property = conditionObj;
                delete node.conditionList;
            }

            if (node.nodeType == 4 || node.nodeType == 5) {
                let approveObj = {
                    emplIds: [],
                    signType: node.signType,
                }
                if (node.nodeApproveList && !isEmptyArray(node.nodeApproveList)) {
                    for (let approve of node.nodeApproveList) {
                        approveObj.emplIds.push(parseInt(approve.targetId));
                    }
                }
                node.nodeProperty = node.setType == 1 ? 5 : node.setType;
                node.property = approveObj;
                delete node.nodeApproveList;
            }
        }
        return nodeList;
    }
    static adapterActivitiNodeList(nodeList) {
        const map = nodeList.reduce((p, c)=> {
            p[c.nodeId] = c
            return p
        }, {})
        let result = []
        for(let i = 0; i < nodeList.length; i++) {
            const node = nodeList[i]
            if(node.nodeTo && node.nodeTo.length === 1) {
                // 网关节点
                const to = map[node.nodeTo[0]]
                // 如果下一级是一个网关节点, 则需要跳过，将下一级指向网关节点的下级
                if(to.nodeType === 2) {
                    node.nodeTo = to.nodeTo
                    for(let j = 0; j < to.nodeTo.length; j++) {
                        map[to.nodeTo[j]].nodeFrom = [node.nodeId]
                    }
                }
            }
            if(node.nodeType !== 2) {
                result.push(node)
            }
        }
        // 通过对nodeTo来构建每个节点的所有父级
        let nodeGroup = {};
        for(let i = 0; i < result.length; i++) {
            const node = result[i]
            for(let j = 0; j < node.nodeTo.length; j++) {
                const id = node.nodeTo[j]
                if(!nodeGroup[id]) {
                    nodeGroup[id] = [node.nodeId]
                } else {
                    if(!nodeGroup[id].includes(node.nodeId)) {
                        nodeGroup[id].push(node.nodeId)
                    }
                }
            }
        }
        for(let i = 0; i < result.length; i++) {
            const node = result[i]
            node.nodeFrom = nodeGroup[node.nodeId] || []
        }
        result.shift()
        const first = this.param.childNode
        let id = ''
        if(first.nodeType === 2) {
            id = first.conditionNodes[0].nodeId
        } else {
            id = first.nodeId
        }
        const index = result.findIndex((c) => c.nodeId === id)
        const node = result[index]
        node.nodeFrom = []
        result.splice(index, 1)
        result.unshift(node)

        return result;
    }

}

