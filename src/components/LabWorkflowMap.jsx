import cytoscape from 'cytoscape';
import { useEffect, useMemo, useRef, useState } from 'react';
import { demoWorkflow } from '../data/lab-workflows/demo-workflow';

export default function LabWorkflowMap() {
  const cyContainerRef = useRef(null);
  const cyRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [numSamples, setNumSamples] = useState(12);
  const [plateCapacity, setPlateCapacity] = useState(6);
  const [overnight, setOvernight] = useState(true);

  const nodesWithDuration = useMemo(() => {
    return demoWorkflow.nodes.map((n) =>
      n.id === 'primary' ? { ...n, duration: overnight ? 600 : 120 } : n
    );
  }, [overnight]);

  const elements = useMemo(() => {
    const nodes = nodesWithDuration.map((n) => ({ data: n }));
    const edges = demoWorkflow.edges.map((e) => ({ data: e }));
    return [...nodes, ...edges];
  }, [nodesWithDuration]);

  // All steps are sequential in the protocol; parallel steps scale by batch count
  const { totalTime, bottleneck } = useMemo(() => {
    const batches = Math.ceil(numSamples / plateCapacity);
    let total = 0;

    nodesWithDuration.forEach((n) => {
      total += n.parallel ? n.duration * batches : n.duration;
    });

    const bottleneckStep = nodesWithDuration.reduce(
      (max, n) => {
        const duration = n.parallel ? n.duration * batches : n.duration;
        return duration > max.duration ? { id: n.id, step: n.label, duration } : max;
      },
      { id: '', step: '', duration: 0 }
    );

    return { totalTime: total, bottleneck: bottleneckStep };
  }, [nodesWithDuration, numSamples, plateCapacity]);

  // Recreate the cytoscape graph when the structure changes (overnight toggle)
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');

    const cy = cytoscape({
      container: cyContainerRef.current,
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
            'background-color': isDark ? '#374151' : '#f3f4f6',
            color: isDark ? '#f9fafb' : '#111827',
            'border-width': 1,
            'border-color': isDark ? '#4b5563' : '#d1d5db',
          },
        },
        {
          selector: 'node[type="parallel"]',
          style: {
            'background-color': isDark ? '#1e3a5f' : '#bfdbfe',
            'border-style': 'dashed',
            'border-color': '#0284c7',
          },
        },
        {
          selector: 'node.bottleneck',
          style: { 'border-color': '#dc2626', 'border-width': 3, 'border-style': 'solid' },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'line-color': isDark ? '#6b7280' : '#9ca3af',
            'target-arrow-color': isDark ? '#6b7280' : '#9ca3af',
          },
        },
      ],
    });

    cyRef.current = cy;
    cy.on('tap', 'node', (evt) => setSelected(evt.target.data()));
    cy.on('tap', (evt) => { if (evt.target === cy) setSelected(null); });
    cy.fit();

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [elements]);

  // Update bottleneck highlight independently — avoids full graph recreation on slider change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.nodes().removeClass('bottleneck');
    if (bottleneck.id) cy.getElementById(bottleneck.id).addClass('bottleneck');
  }, [elements, bottleneck.id]);

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m} min`;
  };

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '3fr 1fr', minHeight: '70vh' }}>
      <div
        ref={cyContainerRef}
        className="rounded-xl border border-gray-200 dark:border-gray-700"
        style={{ height: '70vh' }}
      />

      <aside className="flex flex-col gap-4 border-l border-gray-200 pl-4 dark:border-gray-700">
        <h3 className="font-serif text-lg font-medium">Controls & Step Info</h3>

        <div className="flex flex-col gap-1">
          <label className="text-sm">
            Number of samples: <strong>{numSamples}</strong>
          </label>
          <input
            type="range" min="1" max="96" value={numSamples}
            onChange={(e) => setNumSamples(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">
            Samples per plate: <strong>{plateCapacity}</strong>
          </label>
          <input
            type="range" min="1" max="96" value={plateCapacity}
            onChange={(e) => setPlateCapacity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox" checked={overnight}
              onChange={(e) => setOvernight(e.target.checked)}
            />
            Primary incubation overnight
          </label>
        </div>

        <div className="text-sm">
          <p><strong>Total Runtime:</strong> {formatTime(totalTime)}</p>
          <p><strong>Bottleneck:</strong> {bottleneck.step} ({formatTime(bottleneck.duration)})</p>
        </div>

        <div className="text-sm">
          {selected ? (
            <div>
              <p className="font-medium">{selected.label}</p>
              <p>Type: {selected.type}</p>
              <p>Duration: {formatTime(selected.duration)}</p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Click a node to view details</p>
          )}
        </div>
      </aside>
    </div>
  );
}
