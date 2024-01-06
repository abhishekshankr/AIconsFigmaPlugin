figma.showUI(__html__, { themeColors: true, width: 435, height: 500 });

let lastAppendedIcon: SceneNode | null = null; // Track the last appended icon on the page

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-icon') {
    const svg = msg.svg;
    const name = msg.name;
    const node = await figma.createNodeFromSvg(svg);
    node.name = name;
    node.constrainProportions = true;

    if (figma.editorType === 'figjam') {
      node.resize(64, 64);
    }

    const selection = figma.currentPage.selection;

    if (selection.find(node => node === lastAppendedIcon) && lastAppendedIcon) {
      appendToParentOrPage(node, lastAppendedIcon);
    } else if (selection.length > 0) {
      const selectedNode = selection[selection.length - 1];
      appendToParentOrPage(node, selectedNode);
    } else {
      appendToPage(node);
    }

    figma.currentPage.selection = [node];
  }
};

function appendToPage(node: SceneNode) {
  figma.currentPage.appendChild(node);
  positionNodeToTheRight(node, null); // Pass null as the reference node
}

function appendToParentOrPage(node: SceneNode, referenceNode: SceneNode) {
  const parent = referenceNode.parent && referenceNode.parent.type === 'FRAME' ? referenceNode.parent : figma.currentPage;
  parent.appendChild(node);
  positionNodeToTheRight(node, referenceNode);
}

function positionNodeToTheRight(node: SceneNode, referenceNode: SceneNode | null) {
  if (referenceNode && 'x' in referenceNode) {
    node.x = referenceNode.x + referenceNode.width + 10; // 10 is the gap between icons
    node.y = referenceNode.y;
  } else {
    node.x = Math.round(figma.viewport.center.x);
    node.y = Math.round(figma.viewport.center.y);
  }
  lastAppendedIcon = node;
}

figma.on('selectionchange', () => {
  const currentSelection = figma.currentPage.selection;
  if (lastAppendedIcon && !currentSelection.some(node => node === lastAppendedIcon)) {
    lastAppendedIcon = null;
  }
});
