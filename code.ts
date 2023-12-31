figma.showUI(__html__, { width: 435, height: 500 });

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-icon') {
    const svg = msg.svg;
    const name = msg.name; // Use the name passed in the message
    const node = await figma.createNodeFromSvg(svg);

    // Set the name of the node to the name passed in the message
    node.name = name;

    // Set the position of the new node to the center of the viewport
    node.x = Math.round(figma.viewport.center.x);
    node.y = Math.round(figma.viewport.center.y);

    node.constrainProportions = true;

    if (figma.editorType === 'figjam') {
      node.resize(64, 64);
    }

    // Check if there is a frame or node selected
    const selection = figma.currentPage.selection;
    if (selection.length > 0 && selection[0].type === 'FRAME') {
      // Append the node to the selected frame
      selection[0].appendChild(node);
      node.x = 0;
      node.y = 0;
    } else {
      // If no frame is selected, add the new node to the current page
      figma.currentPage.appendChild(node);
    }

    // Select the new node
    figma.currentPage.selection = [node];
  }
};
