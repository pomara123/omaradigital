export const demoWorkflow = {
    nodes: [
        { id: 'coat', label: 'Plate Coating', type: 'parallel', duration: 60, parallel: true },
        { id: 'block', label: 'Blocking', type: 'parallel', duration: 60, parallel: true },
        { id: 'sample', label: 'Sample Addition', type: 'parallel', duration: 15, parallel: true },
        { id: 'primary', label: 'Primary Ab Incubation', type: 'parallel', duration: 120, parallel: true },
        { id: 'secondary', label: 'Secondary Ab Incubation', type: 'parallel', duration: 60, parallel: true },
        { id: 'substrate', label: 'Substrate Development', type: 'process', duration: 30, parallel: false },
        { id: 'read', label: 'Plate Reading', type: 'process', duration: 10, parallel: false },
    ],
    edges: [
        { id: 'e1', source: 'coat', target: 'block' },
        { id: 'e2', source: 'block', target: 'sample' },
        { id: 'e3', source: 'sample', target: 'primary' },
        { id: 'e4', source: 'primary', target: 'secondary' },
        { id: 'e5', source: 'secondary', target: 'substrate' },
        { id: 'e6', source: 'substrate', target: 'read' },
    ],
};
