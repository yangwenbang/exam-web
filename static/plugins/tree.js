function listToTree(col, pcol, list) {
    var pnodes = [];
    $.each(list, function(i, item) {
        if (item[pcol] == 0) {
            item.nodes = [];
            pnodes.push(item);
        }
    });
    $.each(list, function(i, item) {
        $.each(pnodes, function(s, sitem) {
            if (item[pcol] == sitem[col]) {
                sitem.nodes.push(item);
            }
        })
    })
    return pnodes;
}


function listfpToTree(col, pcol, list) {
    var pnodes = [];
    $.each(list, function(i, item) {
        item.nodes = [];
        if (item[pcol] == 0) {
            item.fp = true;
            pnodes.push(item);
        }
    });
    $.each(list, function(i, item) {
        findParent(col, pcol, item, list);
    })
    return pnodes;
}


function findParent(col, pcol, node, list) {
    if (node[pcol] != 0) {
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (node[pcol] == item[col]) {
                if (item.fp) {
                    node.fp = true;
                    item.nodes.push(node);
                } else {
                    findParent(col, pcol, item, list);
                }
            }
        }
    }
}