figma.showUI(__html__, { width: 435, height: 500 });

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-icon') {
    const svg = msg.svg;
    const name = msg.name; // Use the name passed in the message
    const node = await figma.createNodeFromSvg(svg);
    
    // Set the name of the node to the name passed in the message
    node.name = name;

    // Set the position of the new node to the center of the viewport
    node.x = figma.viewport.center.x;
    node.y = figma.viewport.center.y;

    node.constrainProportions = true;

    if (figma.editorType === 'figjam') {
      node.resize(64, 64);
    }

    // Add the new node to the current page
    figma.currentPage.appendChild(node);

    // Select the new node
    figma.currentPage.selection = [node];
  }
};
