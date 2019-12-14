//index.js
//获取应用实例
const app = getApp()
//treeList是原始数据，应该从接口中获取的，在这里就初始化好数据
var treeList = [ {
  CHILDSHOW: "0",
  CHOOSEWAY: "1",
  MATOBJID: "6",
  OBJINDEX: "1",
  OBJNAME: "默认情形",
  OBJPARENT: "0",
  SELECTSHOW: "1"
},  {
  CHILDSHOW: "0",
  CHOOSEWAY: "1",
  MATOBJID: "90",
  OBJINDEX: "3",
  OBJNAME: "测试对象",
  OBJPARENT: "0",
  SELECTSHOW: "1",
},  {
  CHILDSHOW: "0",
  CHOOSEWAY: "1",
  MATOBJID: "89",
  OBJINDEX: "2",
  OBJNAME: "测试节点",
  OBJPARENT: "1",
  SELECTSHOW: "0",
},  {
  CHILDSHOW: "0",
  CHOOSEWAY: "0",
  MATOBJID: "95",
  OBJINDEX: "8",
  OBJNAME: "子节点1.1",
  OBJPARENT: "2",
  SELECTSHOW: "1"
},  {
  CHILDSHOW: "1",
  CHOOSEWAY: "1",
  MATOBJID: "96",
  OBJINDEX: "9",
  OBJNAME: "子节点1.2",
  OBJPARENT: "2",
  SELECTSHOW: "1"
},  {
  CHILDSHOW: "1",
  CHOOSEWAY: "1",
  MATOBJID: "97",
  OBJINDEX: "10",
  OBJNAME: "子节点1.3",
  OBJPARENT: "2",
  SELECTSHOW: "1"
},  {
  CHILDSHOW: "0",
  CHOOSEWAY: "1",
  MATOBJID: "91",
  OBJINDEX: "4",
  OBJNAME: "测试节点2",
  OBJPARENT: "3",
  SELECTSHOW: "1"
},  {
  CHILDSHOW: "1",
  CHOOSEWAY: "1",
  MATOBJID: "92",
  OBJINDEX: "5",
  OBJNAME: "测试节点3",
  OBJPARENT: "3",
  SELECTSHOW: "1"
},  {
  CHILDSHOW: "1",
  CHOOSEWAY: "1",
  MATOBJID: "93",
  OBJINDEX: "6",
  OBJNAME: "子节点1",
  OBJPARENT: "4",
  SELECTSHOW: "1"
},  {
  CHILDSHOW: "1",
  CHOOSEWAY: "1",
  MATOBJID: "94",
  OBJINDEX: "7",
  OBJNAME: "子节点2",
  OBJPARENT: "4",
  SELECTSHOW: "1"
}]
//newTreeData用来存树节点的数据，具体需要用到是否选中checked和是否展开open两个字段
var newTreeData = [];
//初始化数据，删除会影响初始化
//childshow子节点是否一直显示，chooseway单选还是多选，selectshow子节点是否有选择框
//下面的数据是初始数据，只用来对各个字段进行解释
var treeData = {
    text: '不显示的根节点', //显示文字
    id: 1, //节点id
    parent: 0, //父节点的index
    childshow: 0, //子节点显示方式 0是一直显示，1是点击父节点后子节点显示出来
    chooseway: 0, //子节点的选择方式，0是单选 1是多选
    index: 1, //父级和子级的关联字段
    selectshow: 0, //是否显示选择框，0不显示，1显示
    parentchooseway: 0, //父级的子节点选择方式，用来控制当前节点的展开方式
    parentnodes: '', //所有父节点集合，一直到第二级根节点，第一级根节点不需要，所以第二级的节点作为根节点
    childnodes: '', //所有子节点集合
    siblingsnodes: '', //同级节点集合
    checked: false, //是否选中
    open: true, //子节点列表是否展开
    rootNode: 0, //根节点的index,指第二级根节点
    nodes: [{
      text: '根节点1',
      id: 2,
      parent: 1,
      childshow: 0,
      chooseway: 0,
      index: 2,
      selectshow: 0,
      parentchooseway: 0,
      parentnodes: '1',
      childnodes: '',
      siblingsnodes: '',
      checked: false,
      open: true,
      rootNode: 2
    }]
}
Page({
  data: {
    objectId: "", //获取选中值
    treeData: treeData, //树数据
  },
  onLoad: function() {
    //需要清空树节点数据，不然会出错
    newTreeData = [];
    treeData = {
      id: 0,
      childshow: 1,
      chooseway: 0,
      index: 0,
      selectshow: 0,
      checked: false,
      open: true,
      nodes: this.GetData(0, 0, treeList, "", 0, false, true, "", "", 0, "")
    };
    this.setData({
      treeData: treeData
    })
  },
  clickNode: function(e) {
    var treeData = {
      id: 0,
      childshow: 1,
      chooseway: 0,
      index: 0,
      selectshow: 0,
      checked: false,
      open: true,
      nodes: this.GetData(0, 0, treeList, e.detail.siblingsnodes, e.detail.itemid, e.detail.checked, e.detail.open, e.detail.parentnodes, e.detail.childnodes, e.detail.rootNode, e.detail.type)
    };
    var checkedObjID = this.getCheckedObject();
    this.setData({
      isShowObject: true,
      treeData: treeData,
      objectId: checkedObjID
    })
    this.selectComponent('#myComponent').reInit();
  },
  //获取被选中的情形ID集合
  getCheckedObject() {
    var str = "";
    for (var i in newTreeData) {
      //当被选中且有选择框时
      if (newTreeData[i].checked && newTreeData[i].selectshow == 1) {
        str += str == "" ? newTreeData[i].id : "," + newTreeData[i].id
      }
    }
    return str;
  },
  //根据菜单主键id获取下级菜单        
  //id：菜单主键id        
  //arry：菜单数组信息        
  GetParentArry(id, arry) {
    var newArry = new Array();
    for (var i in arry) {
      if (arry[i].OBJPARENT == id) newArry.push(arry[i]);
    }
    return newArry;
  },
  //获取父级字符串
  GetParentStr(id, str, arry) {
    for (var i in arry) {
      if (arry[i].OBJINDEX == id && arry[i].OBJPARENT != 0) {
        var objparent = arry[i].OBJPARENT;
        str += str == "" ? arry[i].OBJPARENT : "," + arry[i].OBJPARENT
        str = this.GetParentStr(objparent, str, arry);
        break;
      }
    }
    return str;
  },
  //获取第二级根节点ID
  GetRootNode(id, arry) {
    var str = "";
    for (var i in arry) {
      if (arry[i].OBJINDEX == id) {
        if (arry[i].OBJPARENT == 0) {
          str = arry[i].OBJINDEX
        } else {
          str = this.GetRootNode(arry[i].OBJPARENT, arry);
        }
        break;
      }
    }
    return str;
  },
  //获取子级字符串
  //arr是需要查找子级的参数集合
  //str是子级字符串
  //tempstr是存放临时字符串的，用来判断每个参数是否有子级
  GetChildStr(arr, str, tempstr, arry) {
    for (var j in arr) {
      tempstr = ""; //每个参数进行判断子级时把该值设为空
      for (var i in arry) {
        if (arry[i].OBJPARENT == arr[j]) {
          str += str == "" ? arry[i].OBJINDEX : "," + arry[i].OBJINDEX;
          tempstr += tempstr == "" ? arry[i].OBJINDEX : "," + arry[i].OBJINDEX;
        }
      }
      if (tempstr != "") {
        str = this.GetChildStr(tempstr.split(','), str, "", arry);
      }
    }
    return str;
  },
  //id：index 
  //arry：节点数组
  //parentchooseway 父节点的子节点显示方式
  //siblings 被选中节点的同级元素index集合
  //curid 被选中节点的id
  //curchecked 当前节点应该要显示的是否选中状态
  //curopen 当前节点应该要显示的子节点是否展开状态
  //parentnodes 当前节点的父级元素index集合，先查它的父级，再查父级的父级，直到根节点。这些父级组成的字符串
  //childnodes 当前节点的所有子级元素index集合
  //rootNode 当前节点的根节点的index,实际上是第二级根节点
  //type 选中节点的选择框类型
  GetData(id, parentchooseway, arry, siblings, curid, curchecked, curopen, parentnodes, childnodes, rootNode, type) {
    var nodeList = [];
    var childArry = this.GetParentArry(id, arry);
    if (childArry.length > 0) {
      let siblingsNodes = "";
      //获取此父级下的所有节点
      for (var i in childArry) {
        siblingsNodes += siblingsNodes == "" ? childArry[i].OBJINDEX : "," + childArry[i].OBJINDEX;
      }
      //循环所有子节点
      for (var i in childArry) {
        //当前节点的根节点
        var currootNode = this.GetRootNode(childArry[i].OBJINDEX, arry);
        var childList = [];
        //递归查找子节点集合
        childList = this.GetData(childArry[i].OBJINDEX, childArry[i].CHOOSEWAY, arry, siblings, curid, curchecked, curopen, parentnodes, childnodes, rootNode, type);
        var tempStr = "";
        //获取同一级别节点，处于同一个父级下
        if (siblingsNodes != "") {
          tempStr = ("," + siblingsNodes + ",").replace("," + childArry[i].OBJINDEX + ",", ",");
          if (tempStr != "") {
            //去掉首尾逗号
            tempStr = tempStr.replace(/^,+/, "").replace(/,+$/, "")
          }
        }
        let objindex = childArry[i].OBJINDEX;
        let parentstr = this.GetParentStr(objindex, "", arry);
        let childstr = this.GetChildStr([objindex], "", "", arry);
        let tempNode = {};
        //用来获取这个数据原先的数据
        if (newTreeData.length == arry.length) {
          for (var k in newTreeData) {
            if (newTreeData[k].index == childArry[i].OBJINDEX) {
              tempNode = newTreeData[k];
            }
          }
        }
        //如果该节点不是选中节点的父节点，或者原先无树数据集合，或者当前点击后是选中，这些情况下需要走多个判断来确定树节点的选中及展开情况
        //正常情况下newTreeData和arry的长度是一致的，如果不一致，是因为初次加载树时newTreeData为空
        if (("," + parentnodes + ",").indexOf("," + childArry[i].OBJINDEX + ",") == -1 || newTreeData.length < arry.length || curchecked == true) {
          let check = false;
          //如果这个是选中的节点就用返回回来的值
          if (curid == childArry[i].MATOBJID) {
            check = curchecked
          } else if (("," + parentnodes + ",").indexOf("," + childArry[i].OBJINDEX + ",") > -1 && curchecked == true) {
            //如果该节点是选中节点的父级，且当前节点是选中，那么父级也都是选中
            check = true;
          } else if (("," + childnodes + ",").indexOf("," + childArry[i].OBJINDEX + ",") > -1 && curchecked == false) {
            //如果该节点是选中节点的子级，且当前节点是未选中，那么子级都是不选中
            check = false;
          } else if ((type == "checkbox" || (type == "radio" && ("," + siblings + ",").indexOf("," + childArry[i].OBJINDEX + ",") == -1)) && currootNode == rootNode) //tempNode.selectshow == 1 && tempNode.parentchooseway == 1
          {
            //如果勾选的是多选框，并且处于同一个根节点下就还是用原先的选中状态
            //如果勾选的是单选框，且不处于同级，并且处于同一个根节点下就还是用原先的选中状态
            check = tempNode.checked;
          }
          let isopen = true;
          //如果有选择框，并且子节点不是一直显示，再加上未选中那么不展开，当check为false时才进方法
          if (childArry[i].SELECTSHOW == 1 && childArry[i].CHILDSHOW != 0 && !check) {
            isopen = false;
          }
          if (curid == childArry[i].MATOBJID && childArry[i].SELECTSHOW == 1 && childArry[i].CHILDSHOW != 0) {
            //如果当前节点是选中的节点，并且子节点的显示方式是点击显示（1），那么值取传过来的值
            isopen = curopen
          }
          //nodeList存节点的所有数据且和子节点有层级关系
          nodeList.push({
            text: childArry[i].OBJNAME,
            id: childArry[i].MATOBJID,
            parent: childArry[i].OBJPARENT,
            childshow: childArry[i].CHILDSHOW,
            chooseway: childArry[i].CHOOSEWAY,
            index: childArry[i].OBJINDEX,
            selectshow: childArry[i].SELECTSHOW,
            parentchooseway: parentchooseway,
            parentnodes: parentstr,
            childnodes: childstr,
            siblingsnodes: tempStr,
            checked: check,
            open: isopen,
            rootNode: currootNode,
            nodes: childList
          });
          //如果是初次加载的话就把树节点的一些基本信息存储在newTreeData中
          //如果不是初次加载的话就把树节点的信息修改下就行，一般只需要修改是否展开和是否选中两个字段
          if (newTreeData.length < arry.length) {
            newTreeData.push({
              text: childArry[i].OBJNAME,
              id: childArry[i].MATOBJID,
              parent: childArry[i].OBJPARENT,
              childshow: childArry[i].CHILDSHOW,
              chooseway: childArry[i].CHOOSEWAY,
              index: childArry[i].OBJINDEX,
              selectshow: childArry[i].SELECTSHOW,
              parentchooseway: parentchooseway,
              checked: check,
              open: isopen,
              rootNode: currootNode
            })
          } else {
            for (var num in newTreeData) {
              if (newTreeData[num].index == childArry[i].OBJINDEX) {
                newTreeData[num].checked = check;
                newTreeData[num].open = isopen;
                break;
              }
            }
          }
        } else {
          //这种是上面三种情况都不是的时候，这时候这个节点就用它原本的数据就行，不需要改变
          if (tempNode.index == childArry[i].OBJINDEX) {
            nodeList.push({
              text: tempNode.text,
              id: tempNode.id,
              parent: tempNode.parent,
              childshow: tempNode.childshow,
              chooseway: tempNode.chooseway,
              index: tempNode.index,
              selectshow: tempNode.selectshow,
              parentchooseway: tempNode.parentchooseway,
              parentnodes: parentstr,
              childnodes: childstr,
              siblingsnodes: tempStr,
              checked: tempNode.checked,
              open: tempNode.open,
              nodes: childList,
              rootNode: tempNode.rootNode
            });
          }
        }
      }
    } else {
      nodeList = [];
    }
    return nodeList;
  },
})