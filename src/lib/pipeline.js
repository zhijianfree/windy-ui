const width = 120
const height = 50
export default {
  updateNode(pipeline, node, subNodes) {
    console.log('before update', pipeline, node, subNodes)
    if (!subNodes) {
      //删除所有节点
      return
    }
    let pipelineArray = JSON.parse(JSON.stringify(pipeline))

    //找到当前修改跟节点以及所有子节点
    let currentline = []
    pipelineArray.forEach((e) => {
      if (e.group == node.group) {
        currentline.push(e)
      }
    })

    if (currentline.length != subNodes.length + 1) {
      //找到删除的子节点
      let reduceArray = []
      currentline.forEach((e) => {
        let flag = false
        subNodes.forEach((ele) => {
          if (ele.id == e.id) {
            flag = true
          }
        })

        if (!flag) {
          reduceArray.push(e)
        }
      })

      //删除原有的子节点
      let reduceIndex = []
      reduceArray.forEach((e) => {
        let index = pipelineArray.indexOf(e)
        reduceIndex.push(index)
      })
      reduceIndex.forEach((index) => {
        pipelineArray.splice(index, 1)
      })

      let reduceCount = currentline.length - subNodes.length
      let nodeIndex = pipelineArray.indexOf(node)
      pipelineArray.forEach((e) => {
        if (!e.next) {
          return
        }
        //所有前置节点都要删除移除的子节点指向
        let nextArray = e.next
        nextArray.forEach((ele) => {
          let result = reduceIndex.indexOf(ele.index)
          if (result > 0) {
            nextArray.splice(nextArray.indexOf(ele), 1)
          }
        })

        //在修改节点之后的root节点next都要减少reduceCount
        let currentIndex = pipelineArray.indexOf(e)
        if (
          e.root &&
          e.next &&
          e.next.length > 0 &&
          currentIndex >= nodeIndex
        ) {
          e.next.forEach((ele) => {
            ele.index -= reduceCount
          })
        }
      })
    }
    let changeMap = {}
    subNodes.forEach((e) => {
      changeMap[e.actionId] = e.results
    })

    console.log('changeMap', changeMap)
    pipelineArray.forEach((e) => {
      if (e.originData) {
        console.log('e.originData')
        let config = changeMap[e.originData.actionId]
        if (config) {
          console.log('e.originData config', config)
          e.originData.compareInfo = config
        }
      }
    })
    return pipelineArray
  },
  addNode(pipeline, node, subNodes) {
    //新加节点与最后节点互换位置
    console.log(JSON.parse(JSON.stringify(pipeline)), '节点', node)
    let lastNode = pipeline[pipeline.length - 1]
    let wIndex = lastNode.x
    let hIndex = lastNode.y
    node.x = lastNode.x
    node.y = lastNode.y
    node.group = lastNode.group
    lastNode.group = node.id

    //原数组删除最后一个节点
    pipeline.splice(pipeline.length - 1, 1)

    let lastIndex = pipeline.length + 1
    if (subNodes) {
      lastIndex += subNodes.length
    }
    //新加节点指向最后节点
    node.next = [{ index: lastIndex, weight: 0 }]
    pipeline.push(node)

    console.log('last result', pipeline)

    //开始添加子节点
    if (!subNodes) {
      //最后节点横坐标加一个单位，并且重新加入数组
      lastNode.x += width
      pipeline.push(lastNode)
      return
    }

    //获取所有指向新节点的前置节点
    let preNodeArray = []
    pipeline.forEach((ele) => {
      let hasNewNode = false
      ele.next.forEach((e) => {
        if (e.index == pipeline.length - 1) {
          hasNewNode = true
        }
      })

      if (hasNewNode) {
        preNodeArray.push(ele)
      }
    })

    let rootId = node.group
    let index = 0
    subNodes.forEach((e) => {
      let item = {
        id: rootId + '_' + index,
        name: e.name,
        hint: e.name,
        status: 'success',
        group: rootId,
        originData: e.originData,
        next: [],
      }

      item.x = wIndex
      item.y = hIndex + height
      pipeline.push(item)
      node.list.push(item)

      //前置节点指向新节点的子节点
      preNodeArray.forEach((element) => {
        element.next.push({ index: pipeline.length - 1, weight: 0 })
      })
      node.next.push({ index: pipeline.length - 1, weight: 0 })
    })

    //最后节点横坐标加一个单位，并且重新加入数组
    lastNode.x += width
    pipeline.push(lastNode)
    console.log('sub result', pipeline)
  },
  removeNode(pipeline, node) {
    if (node.id != node.group) {
      return this.removeSingleNode(pipeline, node)
    }

    let array = this.transformTreeNode(pipeline)
    let pos = array.findIndex((item) => item.id == node.id)
    let current = array[pos]

    //删除节点的前一个节点需要调整指向坐标
    let leftNode = array[pos - 1]
    leftNode.next = []
    let rightNode = array[pos + 1]
    console.log('rightNode', rightNode)
    leftNode.next.push({
      index: rightNode.id - current.nodes.length - 1,
      width: 0,
    })
    rightNode.nodes.forEach((e) => {
      leftNode.next.push({
        index: e.id - current.nodes.length - 1,
        width: 0,
      })
    })

    //删除节点的后面节点指向坐标只需要减去删除节点长度
    for (let i = pos + 1; i < array.length; i++) {
      console.log('循环遍历' + i, array[i])
      array[i].next.forEach((e) => {
        e.index = e.index - current.nodes.length - 1
      })
    }

    //新数组添加没有改变的节点
    let newArray = []
    for (let i = 0; i < array[pos - 1].id; i++) {
      newArray.push(pipeline[i])
    }

    //新数组添加改变的节点
    let group = null
    for (let i = pos - 1; i < array.length; i++) {
      if (i == pos) {
        continue
      }

      let item = array[i]
      if (item.root) {
        group = newArray.length
        item.group = group
      }
      item.id = newArray.length
      newArray.push(item)
      if (item.nodes && item.nodes.length > 0) {
        item.nodes.forEach((e) => {
          e.id = newArray.length
          e.group = group
          newArray.push(e)
        })
      }
    }

    console.log('delete result', newArray)
    return newArray
  },
  removeSingleNode(pipeline, node) {
    console.log('pipe item', pipeline)
    console.log('start handle single item', node)

    let array = this.transformTreeNode(pipeline)
    let pos = node.group
    console.log('pre item', array[pos - 1])

    //删除节点的前一个根结点设置指向下标
    let newArray = []
    newArray.push({ index: array[pos].id, width: 0 })
    let num = 1
    array[pos].nodes.forEach((e) => {
      if (e.id != node.id) {
        newArray.push({ index: array[pos].id + num, width: 0 })
      }
    })

    console.log('pre root Node index', pipeline[array[pos - 1].id])
    console.log('current index', array[pos])
    console.log('start index', array[pos - 1].id)
    pipeline[array[pos - 1].id].next = newArray
    console.log('怕热nod index', pipeline[array[pos - 1].id])

    //给删除节点的当前根节点和后续根节点的指向下标-1
    pipeline.forEach((e) => {
      if ((e.id > node.id || e.group == node.group) && e.root) {
        e.next.forEach((e) => {
          e.index = e.index - 1
        })
      }
    })
    let index = pipeline.findIndex((item) => item.id == node.id)
    pipeline.splice(index, 1)
    console.log('remove single result', pipeline)
    return pipeline
  },
  moveLeft(pipeline, node) {
    node = this.getRootOfNode(pipeline, node)
    if (node.id <= 2) {
      console.log('已到根结点无法前移')
      return
    }

    let array = this.transformTreeNode(pipeline)
    console.log('流水线', array)
    let index = array.findIndex((item) => item.id == node.id)
    let preRootNode = array[index - 1]
    let beforTwoNode = array[index - 2]

    /**
     * beforTwoNode == preRootNode == node
     */

    let current = JSON.parse(JSON.stringify(array[index]))
    let preRoot = JSON.parse(JSON.stringify(preRootNode))
    let beforTwo = JSON.parse(JSON.stringify(beforTwoNode))
    //preRootNode（node） 下标处理
    current.id = preRoot.id
    let preArray = []
    let num = current.id + current.nodes.length + 1
    for (let ind = 0; ind <= preRoot.nodes.length; ind++) {
      preArray.push({ index: num + ind, width: 0 })
    }
    console.log('计算preArray', preArray)

    //node(preRootNode) 下标处理
    preRoot.id = current.id + current.nodes.length + 1
    let curArray = current.next
    console.log('计算curArray', curArray)

    //beforTwoNode nex下标处理
    let startNum = beforTwo.id + beforTwo.nodes.length + 1
    let beforTwoArray = []
    for (let index = 0; index <= current.nodes.length; index++) {
      beforTwoArray.push({ index: startNum + index, width: 0 })
    }
    console.log('beforTwoArray', beforTwoArray)

    //挪移pre节点位置
    current.next = preArray
    console.log('preRoot.id', current.id)
    pipeline[current.id] = current
    for (let i = 0; i < current.nodes.length; i++) {
      pipeline[current.id + i + 1] = current.nodes[i]
    }

    //挪移current位置
    preRoot.next = curArray
    pipeline[preRoot.id] = preRoot
    for (let i = 0; i < preRoot.nodes.length; i++) {
      pipeline[preRoot.id + i + 1] = preRoot.nodes[i]
    }

    pipeline[beforTwo.id].next = beforTwoArray
    console.log('beforTwo.id', beforTwo.id)
    pipeline[pipeline.length - 1].group = pipeline[pipeline.length - 1].id
  },
  moveRight(pipeline, node) {
    node = this.getRootOfNode(pipeline, node)
    let array = this.transformTreeNode(pipeline)
    let pos = array.findIndex((item) => item.id == node.id)
    if (pos >= array.length - 2) {
      console.log('已到根结点无法后移')
      return
    }
    console.log('node', node)

    let middleNode = array[pos]
    let leftNode = array[pos - 1]
    let rightNode = array[pos + 1]

    let leftArray = []
    rightNode.id = middleNode.id
    for (let i = 0; i <= rightNode.nodes.length; i++) {
      leftArray.push({ index: rightNode.id + i, width: 0 })
    }

    let middleArray = []
    let startIndex = rightNode.id + rightNode.nodes.length + 1
    for (let i = 0; i <= middleNode.nodes.length; i++) {
      middleArray.push({ index: startIndex + i, width: 0 })
    }
    let rightArray = rightNode.next

    pipeline[leftNode.id].next = leftArray

    //转移middle(right)
    rightNode.next = middleArray
    rightNode.group = rightNode.id
    pipeline[rightNode.id] = rightNode
    for (let i = 0; i < rightNode.nodes.length; i++) {
      rightNode.nodes[i].group = rightNode.id
      pipeline[rightNode.id + i + 1] = rightNode.nodes[i]
    }

    //转移right(middle)
    middleNode.id = rightNode.id + rightNode.nodes.length + 1
    middleNode.next = rightArray
    middleNode.group = middleNode.id
    pipeline[middleNode.id] = middleNode
    for (let i = 0; i < middleNode.nodes.length; i++) {
      middleNode.nodes[i].group = middleNode.id
      pipeline[middleNode.id + i + 1] = middleNode.nodes[i]
    }
    pipeline[pipeline.length - 1].group = pipeline[pipeline.length - 1].id
  },
  exchangeData(pipelineForm, nodes) {
    //先获取root节点
    let rootMap = {}
    nodes.forEach((e) => {
      if (!rootMap[e.group]) {
        rootMap[e.group] = []
      }

      rootMap[e.group].push(e)
    })
    console.log('list...', nodes)
    console.log('map', rootMap)

    let pipeline = {
      pipelineName: pipelineForm.pipelineName,
      pipelineType: pipelineForm.pipelineType,
      executeType: pipelineForm.executeType,
      stageList: [],
    }

    let stageId = null
    Object.values(rootMap).forEach((nodeList) => {
      let node = {}
      let subNode = []
      nodeList.forEach((e) => {
        if (e.root) {
          node.stageName = e.name
          node.type = e.group
          node.stageId = e.stageId
          node.configId = e.configId
          stageId = e.stageId
        } else {
          console.log('sub item', e)
          let data = e.originData.results
          if (!data) {
            data = e.originData.compareInfo
          }
          let nodeConfig = {
            actionId: e.originData.actionId,
            compareInfo: data,
          }
          subNode.push({
            nodeName: e.name,
            configDetail: JSON.stringify(nodeConfig),
            type: e.group,
            nodeId: e.nodeId,
            stageId: stageId,
          })
        }
      })

      node.nodes = subNode
      pipeline.stageList.push(node)
    })
    console.log('转换结果', pipeline)
    return pipeline
  },
  displayData(list) {
    // console.log('list', list)
    let data = []
    let preNode = {
      next: [],
    }
    let index = 0
    let groupId = 0
    list.forEach((e) => {
      let rootNode = {
        id: index,
        name: e.stageName,
        hint: e.stageName,
        status: 'success',
        group: groupId,
        root: true,
        stageId: e.stageId,
        configId: e.configId,
        list: e.nodes,
        next: [],
      }
      data.push(rootNode)

      // console.log("preNode", preNode, "rootNode", rootNode);
      preNode.next.push({ index: index, weight: 0 })
      index++
      if (e.nodes) {
        e.nodes.forEach((ele) => {
          data.push({
            id: index,
            name: ele.nodeName,
            hint: ele.nodeName,
            status: 'success',
            group: groupId,
            nodeId: ele.nodeId,
            originData: JSON.parse(ele.configDetail),
            next: [],
          })
          preNode.next.push({ index: index, weight: 0 })
          index++
        })
      }

      preNode = rootNode
      groupId++
    })

    data[0].status = 'start'
    data[data.length - 1].status = 'end'
    console.log('filnal', data)
    return data
  },
  getRootOfNode(pipeline, node) {
    if (node.root) {
      return node
    }

    let result = node
    pipeline.forEach((e) => {
      if (e.group == node.group && e.root) {
        result = e
      }
    })
    return result
  },
  transformTreeNode(pipeline) {
    let array = []
    let preNode = {}
    let itemArray = []
    pipeline.forEach((e) => {
      if (e.root) {
        preNode.nodes = JSON.parse(JSON.stringify(itemArray))
        preNode = e
        array.push(e)
        itemArray = []
      } else {
        itemArray.push(e)
      }
    })

    array[array.length - 1].nodes = []
    return array
  },
}
