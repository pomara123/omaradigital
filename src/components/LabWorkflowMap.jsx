import cytoscape from 'cytoscape';
import { useEffect, useMemo, useState } from 'react';
import { demoWorkflow } from '../data/lab-workflows/demo-workflow';

export default function LabWorkflowMap() {
  const [selected, setSelected] = useState(null);
  const [numSamples, setNumSamples] = useState(12);
  const [gelSize, setGelSize] = useState(6);
  const [overnight, setOvernight] = useState(true);

  // Adjust node durations dynamically
  const nodesWithDuration = useMemo(() => {
    return demoWorkflow.nodes.map((n) =>
      n.id === 'primary' ? { ...n, duration: overnight ? 600 : 60 } : n
    );
  }, [overnight]);

  const elements = useMemo(() => {
    const nodes = nodesWithDuration.map((n) => ({ data: n }));
    const edges = demoWorkflow.edges.map((e) => ({ data: e }));
    return [...nodes, ...edges];
  }, [nodesWithDuration]);

  // Compute total time and bottleneck
  const { totalTime, bottleneck } = useMemo(() => {
    let total = 0;
    let maxParallel = 0;

    nodesWithDuration.forEach((n) => {
      let stepTime = n.duration;
      if (n.parallel) stepTime *= Math.ceil(numSamples / gelSize);
      if (!n.parallel) total += stepTime;
      else maxParallel = Math.max(maxParallel, stepTime);
    });

    total += maxParallel;

    const bottleneckStep = nodesWithDuration.reduce(
      (max, n) => {
        let duration = n.parallel ? n.duration * Math.ceil(numSamples / gelSize) : n.duration;
        return duration > max.duration ? { step: n.label, duration } : max;
      },
      { step: '', duration: 0 }
    );

    return { totalTime: total, bottleneck: bottleneckStep };
  }, [nodesWithDuration, numSamples, gelSize]);

  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById('workflow-cy'),
      elements,
      layout: { name: 'breadthfirst', directed: true, spacingFactor: 1.5, padding: 50 },
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            shape: 'round-rectangle',
            width: 180,
            height: 60,
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': '#f3f4f6',
            color: '#111827',
            'border-width': 1,
            'border-color': '#d1d5db',
          },
        },
        {
          selector: 'node[type="parallel"]',
          style: { 'background-color': '#bfdbfe', 'border-style': 'dashed', 'border-color': '#0284c7' },
        },
        {
          selector: 'edge',
          style: { width: 2, 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'line-color': '#9ca3af', 'target-arrow-color': '#9ca3af' },
        },
      ],
    });

    cy.on('tap', 'node', (evt) => setSelected(evt.target.data()));
    cy.on('tap', (evt) => { if (evt.target === cy) setSelected(null); });
    cy.fit();

    return () => cy.destroy();
  }, [elements]);

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m} min`;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', minHeight: '70vh' }}>
      <div id="workflow-cy" style={{ height: '70vh', width: '100%', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
      
      <aside style={{ paddingLeft: '16px', borderLeft: '1px solid #e5e7eb' }}>
        <h3>Controls & Step Info</h3>

        <div style={{ marginBottom: '12px' }}>
          <label>Number of samples: {numSamples}</label>
          <input type="range" min="1" max="24" value={numSamples} onChange={(e) => setNumSamples(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Gel size (lanes per gel): {gelSize}</label>
          <input type="range" min="1" max="12" value={gelSize} onChange={(e) => setGelSize(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            <input type="checkbox" checked={overnight} onChange={(e) => setOvernight(e.target.checked)} style={{ marginRight: '8px' }} />
            Primary incubation overnight
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <strong>Total Runtime:</strong> {formatTime(totalTime)} <br />
          <strong>Bottleneck:</strong> {bottleneck.step} ({formatTime(bottleneck.duration)})
        </div>

        <div>
          {selected ? (
            <>
              <h4>{selected.label}</h4>
              <p>Type: {selected.type}</p>
              <p>Duration: {formatTime(selected.duration)}</p>
            </>
          ) : (
            <p>Click a node to view details</p>
          )}
        </div>
      </aside>
    </div>
  );
}
