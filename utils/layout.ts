import dagre from 'dagre';
import { Position, type Node, type Edge } from 'reactflow';
import { Table } from '../types';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 260; // Slightly wider for better readability
const HEADER_HEIGHT = 45;
const ROW_HEIGHT = 36; // Height per column
const PADDING = 20;

export const getLayoutedElements = (nodes: Node<Table>[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  
  // Increased separation for cleaner layout
  dagreGraph.setGraph({ 
    rankdir: direction, 
    ranksep: 120, 
    nodesep: 80 
  });

  nodes.forEach((node) => {
    // Dynamically calculate height based on the number of columns
    // This prevents nodes from overlapping when using dagre
    const columnCount = node.data.columns ? node.data.columns.length : 0;
    const height = HEADER_HEIGHT + (columnCount * ROW_HEIGHT) + PADDING;
    
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    // We also use the dynamic height we calculated for the offset
    const columnCount = node.data.columns ? node.data.columns.length : 0;
    const height = HEADER_HEIGHT + (columnCount * ROW_HEIGHT) + PADDING;

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};