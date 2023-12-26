figma.showUI(__html__, { width: 390, height: 500 });

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-icon') {
    const svg = msg.svg;
    const node = await figma.createNodeFromSvg(svg);
    
    // Set the position of the new node to the center of the viewport
    node.x = figma.viewport.center.x;
    node.y = figma.viewport.center.y;

    // Add the new node to the current page
    figma.currentPage.appendChild(node);

    // Select the new node
    figma.currentPage.selection = [node];
  }
};