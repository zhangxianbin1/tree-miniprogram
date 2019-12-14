// pages/components/mytree/mytree.js
Component({
  properties: {
    model: Object,
  },

  data: {
    allopen: false,
    open: true,
    isBranch: false,
    checked: false
  },

  methods: {
    toggle: function (e) {
      if (this.data.isBranch) {
        this.setData({
          //open: !this.data.open,
        })
      }
    },

    tapItem: function (e) {
      var itemid = e.currentTarget.dataset.itemid;
      console.log('组件里点击的id: ' + itemid);
      this.triggerEvent('tapitem', { itemid: itemid }, { bubbles: true, composed: true });
    },
    clickNode: function (e) {
      var itemid = e.currentTarget.dataset.itemid;
      var parentnodes = e.currentTarget.dataset.parentnodes;
      var childnodes = e.currentTarget.dataset.childnodes;
      var siblingsnodes = e.currentTarget.dataset.siblingsnodes;
      var rootNode = e.currentTarget.dataset.rootnode;
      var type = e.currentTarget.dataset.type;
      console.log(e.currentTarget.dataset);
      this.triggerEvent('clickNode', { parentnodes: parentnodes, itemid: itemid, siblingsnodes: siblingsnodes, checked: !this.data.checked, open: !this.data.open, childnodes: childnodes, rootNode: rootNode, type: type }, { bubbles: true, composed: true })
    },
    reInit: function () {
      this.setData({
        isBranch: Boolean(this.data.model.nodes && this.data.model.nodes.length),
        open: Boolean(this.data.model.open),
        checked: Boolean(this.data.model.checked)
      });
      for (let i = 0; i < this.data.model.nodes.length; i++) {
        this.selectComponent('#component' + this.data.model.nodes[i].id).reInit();
      }
      //this.triggerEvent('reInit', {  }, { bubbles: true, composed: true })
    },
  },

  ready: function (e) {
    this.setData({
      isBranch: Boolean(this.data.model.nodes && this.data.model.nodes.length),
      open: !Boolean(this.data.model.selectshow == 1 && this.data.model.childshow != 0),
      checked: Boolean(this.data.model.checked)
    });
  },
})

































