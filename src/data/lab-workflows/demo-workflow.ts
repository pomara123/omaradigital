export const demoWorkflow = {
    nodes: [
      { id: 'sample', label: 'Sample Addition', type: 'sample', duration: 15, parallel: false },
      { id: 'coat', label: 'Plate Coating', type: 'process', duration: 60, parallel: false },
      { id: 'block', label: 'Blocking', type: 'process', duration: 60, parallel: true },
      { id: 'primary', label: 'Primary Ab Incubation', type: 'parallel', duration: 120, parallel: true },
      { id: 'secondary', label: 'Secondary Ab Incubation', type: 'parallel', duration: 60, parallel: true },
      { id: 'substrate', label: 'Substrate Development', type: 'process', duration: 30, parallel: false },
      { id: 'read', label: 'Plate Reading', type: 'output', duration: 10, parallel: false },
    ],
    edges: [
      { id: 'e1', source: 'sample', target: 'coat' },
      { id: 'e2', source: 'coat', target: 'block' },
      { id: 'e3', source: 'block', target: 'primary' },
      { id: 'e4', source: 'primary', target: 'secondary' },
      { id: 'e5', source: 'secondary', target: 'substrate' },
      { id: 'e6', source: 'substrate', target: 'read' },
    ],
  };
  