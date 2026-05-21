import jsPDF from 'jspdf';
import { useMemo, useRef, useState } from 'react';

const LEVELS = ['None', 'Ad Hoc', 'Defined', 'Operational', 'Optimized'];

const DEFAULT_CATEGORIES = [
    {
        id: 'policies',
        label: 'Policies & Standards',
        shortLabel: 'Policies',
        items: [
            { text: 'Data classification policy defined and communicated', weight: 1 },
            { text: 'Data retention and archival policy documented', weight: 2 },
            { text: 'Naming and coding conventions established', weight: 1 },
            { text: 'Data ownership model with assigned owners per domain', weight: 1 },
        ],
    },
    {
        id: 'stewardship',
        label: 'Data Stewardship',
        shortLabel: 'Stewardship',
        items: [
            { text: 'Data stewards assigned for each key data domain', weight: 1 },
            { text: 'Governance council or committee meets regularly', weight: 1 },
            { text: 'Escalation path for data conflicts clearly defined', weight: 1 },
        ],
    },
    {
        id: 'quality',
        label: 'Data Quality',
        shortLabel: 'Quality',
        items: [
            { text: 'Data quality rules documented per key dataset', weight: 1 },
            { text: 'Automated quality checks implemented', weight: 2 },
            { text: 'Quality metrics tracked and reviewed on a cadence', weight: 1 },
            { text: 'Data lineage documented end-to-end', weight: 2 },
        ],
    },
    {
        id: 'systems',
        label: 'Systems & Tooling',
        shortLabel: 'Systems',
        items: [
            { text: 'Scientific data management system (LIMS/ELN) in use', weight: 2 },
            { text: 'Data catalog or metadata repository maintained', weight: 1 },
            { text: 'Integration monitoring and alerting configured', weight: 2 },
            { text: 'Master data management process defined', weight: 1 },
        ],
    },
    {
        id: 'access',
        label: 'Access & Security',
        shortLabel: 'Access',
        items: [
            { text: 'Role-based access control implemented across systems', weight: 2 },
            { text: 'Formal data access request and approval process defined', weight: 2 },
            { text: 'Periodic access reviews and recertification conducted', weight: 2 },
        ],
    },
    {
        id: 'compliance',
        label: 'Compliance & Audit',
        shortLabel: 'Compliance',
        items: [
            { text: 'Data integrity controls aligned to GxP requirements', weight: 3 },
            { text: 'Electronic records compliant (21 CFR Part 11 or equivalent)', weight: 3 },
            { text: 'Audit trails enabled and regularly reviewed', weight: 3 },
            { text: 'Change control process for validated systems documented', weight: 2 },
        ],
    },
    {
        id: 'metadata',
        label: 'Metadata Governance',
        shortLabel: 'Metadata',
        items: [
            { text: 'Metadata standards defined and enforced across datasets', weight: 1 },
            { text: 'Controlled vocabularies or ontologies in use for key fields', weight: 1 },
            { text: 'Schema governance process established for dataset changes', weight: 2 },
            { text: 'Cross-study metadata harmonization standards defined', weight: 1 },
        ],
    },
    {
        id: 'analytics',
        label: 'AI & Analytics Governance',
        shortLabel: 'Analytics',
        items: [
            { text: 'Approved analytical datasets managed and versioned', weight: 2 },
            { text: 'AI/ML model governance process defined', weight: 2 },
            { text: 'Reproducibility standards established for analyses', weight: 1 },
            { text: 'Feature lineage and model provenance tracked', weight: 1 },
        ],
    },
];

function validateCriteria(data) {
    if (!data || !Array.isArray(data.categories)) return 'Missing "categories" array.';
    const cats = data.categories;
    if (cats.length < 2 || cats.length > 10) return 'Must have between 2 and 10 categories.';
    for (const cat of cats) {
        if (!cat.id || !cat.label || !cat.shortLabel) return `Category missing id, label, or shortLabel.`;
        if (!Array.isArray(cat.items) || cat.items.length === 0) return `Category "${cat.label}" has no items.`;
        for (const item of cat.items) {
            if (!item.text) return `Item in "${cat.label}" is missing "text".`;
            if (typeof item.weight !== 'number' || item.weight < 1 || item.weight > 3)
                return `Item "${item.text}" weight must be 1, 2, or 3.`;
        }
    }
    return null;
}

const WEIGHTS = [
    { w: 1, icon: '○', label: 'Standard', detail: 'Standard priority — counts at face value', selectedClass: 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200' },
    { w: 2, icon: '●', label: 'Regulated', detail: 'Regulated — counts 2× in Compliance Readiness (audit trails, access controls, etc.)', selectedClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400' },
    { w: 3, icon: '▲', label: 'Critical', detail: 'Critical — counts 3× in Compliance Readiness (GxP, 21 CFR Part 11, etc.)', selectedClass: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' },
];

function WeightSelector({ value, onChange }) {
    return (
        <div className="flex shrink-0 gap-0.5">
            {WEIGHTS.map(({ w, icon, detail, selectedClass }) => (
                <button
                    key={w}
                    onClick={() => onChange(w)}
                    title={detail}
                    className={`flex h-5 w-5 items-center justify-center rounded text-xs transition-colors ${
                        value === w
                            ? selectedClass
                            : 'bg-gray-50 text-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-600 dark:hover:bg-gray-700'
                    }`}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
}

function MaturitySelector({ value, onChange }) {
    return (
        <div className="flex shrink-0 gap-0.5">
            {LEVELS.map((label, level) => (
                <button
                    key={level}
                    onClick={() => onChange(level)}
                    title={`${level}: ${label}`}
                    className={`h-5 w-5 rounded text-xs font-medium transition-colors ${
                        value === level
                            ? level === 0
                                ? 'bg-gray-400 text-white'
                                : level <= 2
                                ? 'bg-blue-500 text-white'
                                : 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600'
                    }`}
                >
                    {level}
                </button>
            ))}
        </div>
    );
}

function RadarChart({ categories, scores, svgRef }) {
    const cx = 210, cy = 200, r = 120;
    const n = categories.length;

    const getPoint = (i, value) => {
        const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
        return [cx + value * r * Math.cos(angle), cy + value * r * Math.sin(angle)];
    };

    const toPoints = (values) => values.map((v, i) => getPoint(i, v).join(',')).join(' ');

    const getTextAnchor = (i) => {
        const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
        const x = Math.cos(angle);
        if (x > 0.2) return 'start';
        if (x < -0.2) return 'end';
        return 'middle';
    };

    const gridLevels = [0.25, 0.5, 0.75, 1.0];

    return (
        <svg ref={svgRef} viewBox="0 0 420 400" className="w-full max-w-sm mx-auto">
            {gridLevels.map((level) => (
                <polygon key={level} points={toPoints(categories.map(() => level))} fill="none" stroke="#e5e7eb" strokeWidth="1" />
            ))}
            {gridLevels.map((level) => {
                const [x, y] = getPoint(0, level);
                return <text key={level} x={x + 4} y={y} fontSize="8" fill="#9ca3af">{level * 100}%</text>;
            })}
            {categories.map((_, i) => {
                const [x, y] = getPoint(i, 1);
                return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
            })}
            <polygon points={toPoints(categories.map(() => 1))} fill="#dbeafe" fillOpacity="0.3" stroke="#93c5fd" strokeWidth="1" strokeDasharray="4" />
            <polygon points={toPoints(scores)} fill="#16a34a" fillOpacity="0.3" stroke="#16a34a" strokeWidth="2" />
            {scores.map((s, i) => {
                const [x, y] = getPoint(i, s);
                return <circle key={i} cx={x} cy={y} r="4" fill="#16a34a" />;
            })}
            {categories.map((cat, i) => {
                const [x, y] = getPoint(i, 1.38);
                return (
                    <text key={i} x={x} y={y} textAnchor={getTextAnchor(i)} dominantBaseline="middle" fontSize="10" fontWeight="500" fill="#374151">
                        {cat.shortLabel}
                    </text>
                );
            })}
        </svg>
    );
}

export default function GovernanceGapAnalyzer() {
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [answers, setAnswers] = useState(() => DEFAULT_CATEGORIES.map((cat) => cat.items.map(() => 0)));
    const [isCustom, setIsCustom] = useState(false);
    const [importError, setImportError] = useState('');
    const [pdfExporting, setPdfExporting] = useState(false);
    const fileInputRef = useRef(null);
    const radarRef = useRef(null);

    const loadCategories = (newCategories) => {
        setCategories(newCategories);
        setAnswers(newCategories.map((cat) => cat.items.map(() => 0)));
        setImportError('');
    };

    const reset = () => setAnswers(categories.map((cat) => cat.items.map(() => 0)));

    const restoreDefaults = () => {
        loadCategories(DEFAULT_CATEGORIES);
        setIsCustom(false);
    };

    const handleExport = () => {
        const data = JSON.stringify({ version: '1.0', categories }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'governance-criteria.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                const error = validateCriteria(parsed);
                if (error) {
                    setImportError(error);
                } else {
                    loadCategories(parsed.categories);
                    setIsCustom(true);
                }
            } catch {
                setImportError('Could not parse file — make sure it is valid JSON.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleExportPDF = async () => {
        setPdfExporting(true);
        try {
            const doc = new jsPDF({ unit: 'mm', format: 'a4' });
            const margin = 16;
            const pageW = 210;
            const contentW = pageW - 2 * margin;
            let y = margin;

            // Header
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(17);
            doc.setTextColor(30, 30, 30);
            doc.text('Data Governance Gap Analysis', margin, y);
            y += 6;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(120, 120, 120);
            doc.text(
                new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                margin,
                y
            );
            y += 10;

            // Score summary boxes
            const boxW = (contentW - 6) / 2;
            const drawScoreBox = (label, score, bx) => {
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.roundedRect(bx, y, boxW, 17, 2, 2, 'S');
                doc.setFontSize(7.5);
                doc.setTextColor(100, 100, 100);
                doc.setFont('helvetica', 'normal');
                doc.text(label, bx + boxW / 2, y + 5.5, { align: 'center' });
                const c = score >= 75 ? [22, 163, 74] : score >= 50 ? [161, 98, 7] : [185, 28, 28];
                doc.setTextColor(...c);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(19);
                doc.text(`${score}%`, bx + boxW / 2, y + 13.5, { align: 'center' });
            };
            drawScoreBox('Overall Maturity', overallScore, margin);
            drawScoreBox('Compliance Readiness', complianceScore, margin + boxW + 6);
            y += 22;

            // Key / legend
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.roundedRect(margin, y, contentW, 14, 2, 2, 'S');
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(80, 80, 80);
            doc.text('Maturity:', margin + 3, y + 5);
            doc.setFont('helvetica', 'normal');
            doc.text('0 = None   1 = Ad Hoc   2 = Defined   3 = Operational   4 = Optimized', margin + 18, y + 5);
            doc.setFont('helvetica', 'bold');
            doc.text('Priority:', margin + 3, y + 10.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text('(none) = Standard   ', margin + 18, y + 10.5);
            doc.setTextColor(194, 65, 12);
            doc.text('[R] = Regulated (2x weight in compliance score)   ', margin + 53, y + 10.5);
            doc.setTextColor(185, 28, 28);
            doc.text('[!] = Critical (3x weight, GxP / regulatory)', margin + 122, y + 10.5);
            y += 20;

            // Radar chart via SVG → canvas → PNG
            if (radarRef.current) {
                await new Promise((resolve) => {
                    try {
                        const svgEl = radarRef.current;
                        const svgData = new XMLSerializer().serializeToString(svgEl);
                        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                        const svgUrl = URL.createObjectURL(svgBlob);
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = 420;
                            canvas.height = 400;
                            const ctx = canvas.getContext('2d');
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, 420, 400);
                            ctx.drawImage(img, 0, 0);
                            URL.revokeObjectURL(svgUrl);
                            const chartW = 72;
                            const chartH = chartW * (400 / 420);
                            doc.addImage(
                                canvas.toDataURL('image/png'),
                                'PNG',
                                margin + (contentW - chartW) / 2,
                                y,
                                chartW,
                                chartH
                            );
                            y += chartH + 8;
                            resolve();
                        };
                        img.onerror = () => { URL.revokeObjectURL(svgUrl); resolve(); };
                        img.src = svgUrl;
                    } catch {
                        resolve();
                    }
                });
            }

            // Category scores grid
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(30, 30, 30);
            doc.text('Category Scores', margin, y);
            y += 5;

            const colW = contentW / 4;
            categories.forEach((cat, i) => {
                const score = Math.round(categoryScores[i] * 100);
                const cx = margin + (i % 4) * colW;
                const rowY = y + Math.floor(i / 4) * 8;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(80, 80, 80);
                doc.text(cat.shortLabel, cx, rowY + 3.5);
                const c = score >= 75 ? [22, 163, 74] : score >= 50 ? [161, 98, 7] : [185, 28, 28];
                doc.setTextColor(...c);
                doc.setFont('helvetica', 'bold');
                doc.text(`${score}%`, cx + colW - 8, rowY + 3.5);
            });
            y += Math.ceil(categories.length / 4) * 8 + 8;

            // Priority gaps
            if (topGaps.length > 0) {
                if (y > 240) { doc.addPage(); y = margin; }
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10.5);
                doc.setTextColor(30, 30, 30);
                doc.text('Gap Analysis', margin, y);
                y += 5;

                topGaps.forEach(({ label, score, gapItems }) => {
                    if (y > 270) { doc.addPage(); y = margin; }
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8.5);
                    doc.setTextColor(30, 30, 30);
                    doc.text(`${label}  —  ${Math.round(score * 100)}%`, margin, y);
                    y += 4.5;
                    gapItems.slice(0, 5).forEach(({ text, level }) => {
                        if (y > 275) { doc.addPage(); y = margin; }
                        const levelLabel = LEVELS[level];
                        const c = level === 0 ? [185, 28, 28] : level === 1 ? [194, 65, 12] : [161, 98, 7];
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(7.5);
                        doc.setTextColor(...c);
                        doc.text(levelLabel, margin + 3, y);
                        doc.setFont('helvetica', 'normal');
                        doc.setTextColor(60, 60, 60);
                        doc.text(doc.splitTextToSize(text, contentW - 26)[0], margin + 22, y);
                        y += 4.5;
                    });
                    y += 2;
                });
                y += 4;
            }

            // Detailed assessment
            if (y > 220) { doc.addPage(); y = margin; }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(30, 30, 30);
            doc.text('Detailed Assessment', margin, y);
            y += 6;

            for (let ci = 0; ci < categories.length; ci++) {
                if (y > 262) { doc.addPage(); y = margin; }
                const cat = categories[ci];
                const catScore = Math.round(categoryScores[ci] * 100);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8.5);
                doc.setTextColor(30, 30, 30);
                doc.text(`${cat.label}`, margin, y);
                const c = catScore >= 75 ? [22, 163, 74] : catScore >= 50 ? [161, 98, 7] : [185, 28, 28];
                doc.setTextColor(...c);
                doc.text(`${catScore}%`, margin + contentW, y, { align: 'right' });
                y += 4.5;

                cat.items.forEach((item, ii) => {
                    if (y > 275) { doc.addPage(); y = margin; }
                    const level = answers[ci][ii];
                    const levelLabel = LEVELS[level];
                    const wIcon = item.weight === 3 ? '[!]' : item.weight === 2 ? '[R]' : '';
                    const wColor = item.weight === 3 ? [185, 28, 28] : item.weight === 2 ? [194, 65, 12] : [160, 160, 160];
                    const lc = level === 0 ? [185, 28, 28] : level <= 1 ? [194, 65, 12] : level <= 2 ? [161, 98, 7] : [22, 163, 74];
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(7.5);
                    doc.setTextColor(...wColor);
                    doc.text(wIcon, margin + 2, y);
                    doc.setTextColor(60, 60, 60);
                    doc.text(doc.splitTextToSize(item.text, contentW - 32)[0], margin + 7, y);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(...lc);
                    doc.text(levelLabel, margin + contentW, y, { align: 'right' });
                    y += 4.5;
                });
                y += 3;
            }

            // Footer on every page
            const pageCount = doc.getNumberOfPages();
            for (let p = 1; p <= pageCount; p++) {
                doc.setPage(p);
                doc.setFontSize(7);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(160, 160, 160);
                doc.text(
                    `Page ${p} of ${pageCount}  ·  omaradigital.com`,
                    pageW / 2,
                    291,
                    { align: 'center' }
                );
            }

            doc.save('governance-gap-analysis.pdf');
        } finally {
            setPdfExporting(false);
        }
    };

    const setWeight = (catIdx, itemIdx, weight) => {
        setCategories((prev) =>
            prev.map((cat, ci) =>
                ci === catIdx
                    ? { ...cat, items: cat.items.map((item, ii) => (ii === itemIdx ? { ...item, weight } : item)) }
                    : cat
            )
        );
    };

    const setLevel = (catIdx, itemIdx, level) => {
        setAnswers((prev) =>
            prev.map((cat, ci) =>
                ci === catIdx ? cat.map((val, ii) => (ii === itemIdx ? level : val)) : cat
            )
        );
    };

    const categoryScores = useMemo(
        () =>
            categories.map((cat, ci) => {
                const totalWeight = cat.items.reduce((sum, item) => sum + item.weight, 0);
                const weightedSum = cat.items.reduce(
                    (sum, item, ii) => sum + (answers[ci][ii] / 4) * item.weight,
                    0
                );
                return totalWeight === 0 ? 0 : weightedSum / totalWeight;
            }),
        [categories, answers]
    );

    const overallScore = useMemo(() => {
        const allItems = categories.flatMap((cat, ci) =>
            cat.items.map((item, ii) => ({ weight: item.weight, level: answers[ci][ii] }))
        );
        const totalWeight = allItems.reduce((sum, { weight }) => sum + weight, 0);
        const weightedSum = allItems.reduce((sum, { weight, level }) => sum + (level / 4) * weight, 0);
        return Math.round((weightedSum / totalWeight) * 100);
    }, [categories, answers]);

    const complianceScore = useMemo(() => {
        const regulatedItems = categories.flatMap((cat, ci) =>
            cat.items
                .map((item, ii) => ({ weight: item.weight, level: answers[ci][ii] }))
                .filter(({ weight }) => weight >= 2)
        );
        const totalWeight = regulatedItems.reduce((sum, { weight }) => sum + weight, 0);
        const weightedSum = regulatedItems.reduce((sum, { weight, level }) => sum + (level / 4) * weight, 0);
        return totalWeight === 0 ? 0 : Math.round((weightedSum / totalWeight) * 100);
    }, [categories, answers]);

    const topGaps = useMemo(
        () =>
            categories
                .map((cat, ci) => ({
                    label: cat.label,
                    score: categoryScores[ci],
                    gapItems: cat.items
                        .map((item, ii) => ({ ...item, level: answers[ci][ii] }))
                        .filter(({ level }) => level < 4)
                        .sort((a, b) => (4 - b.level) * b.weight - (4 - a.level) * a.weight),
                }))
                .filter(({ gapItems }) => gapItems.length > 0)
                .sort((a, b) => a.score - b.score),
        [categories, categoryScores, answers]
    );

    const scoreColor = (score) =>
        score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="not-prose mt-6 flex flex-col gap-10">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-gray-50 px-4 py-2.5 text-xs text-gray-500 dark:bg-gray-800">
                <span>
                    <strong>Maturity:</strong> 0 = None · 1 = Ad Hoc · 2 = Defined · 3 = Operational · 4 = Optimized
                </span>
                <span>
                    <strong>Priority:</strong>{' '}
                    <span className="text-gray-500">○ Standard</span> ·{' '}
                    <span className="text-orange-500">● Regulated</span>{' '}
                    <span className="text-gray-400">(2× compliance weight)</span> ·{' '}
                    <span className="text-red-500">▲ Critical</span>{' '}
                    <span className="text-gray-400">(3× — GxP / regulatory)</span>
                </span>
                <div className="ml-auto flex items-center gap-3">
                    {isCustom && (
                        <button onClick={restoreDefaults} className="underline hover:text-gray-700 dark:hover:text-gray-200">
                            Restore defaults
                        </button>
                    )}
                    <button onClick={reset} className="underline hover:text-gray-700 dark:hover:text-gray-200">
                        Reset scores
                    </button>
                    <button
                        onClick={handleExportPDF}
                        disabled={pdfExporting}
                        className="rounded border border-gray-300 px-2 py-0.5 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        {pdfExporting ? 'Generating…' : 'Export PDF'}
                    </button>
                    <button onClick={handleExport} className="rounded border border-gray-300 px-2 py-0.5 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                        Export criteria
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded border border-gray-300 px-2 py-0.5 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        Import criteria
                    </button>
                    <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
                </div>
            </div>

            {importError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                    <strong>Import failed:</strong> {importError}
                </div>
            )}

            {isCustom && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400">
                    Using custom criteria — {categories.length} categories loaded.
                </div>
            )}

            <div className="grid gap-10 lg:grid-cols-2">
                {/* Checklist */}
                <div className="flex flex-col gap-7">
                    {categories.map((cat, catIdx) => (
                        <div key={cat.id}>
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="font-serif text-base font-medium">{cat.label}</h4>
                                <span className="text-sm text-gray-400">
                                    {Math.round(categoryScores[catIdx] * 100)}%
                                </span>
                            </div>
                            <ul className="flex flex-col gap-2.5">
                                {cat.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start gap-2">
                                        <span className="mt-0.5 text-sm leading-none">
                                            {item.weight >= 3 ? (
                                                <span className="text-red-500">▲</span>
                                            ) : item.weight === 2 ? (
                                                <span className="text-orange-500">●</span>
                                            ) : (
                                                <span className="text-gray-300 dark:text-gray-600">○</span>
                                            )}
                                        </span>
                                        <span className="min-w-0 flex-1 text-sm">{item.text}</span>
                                        <div className="flex shrink-0 items-center gap-1.5">
                                            <WeightSelector
                                                value={item.weight}
                                                onChange={(w) => setWeight(catIdx, itemIdx, w)}
                                            />
                                            <MaturitySelector
                                                value={answers[catIdx][itemIdx]}
                                                onChange={(level) => setLevel(catIdx, itemIdx, level)}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Radar + Scores */}
                <div className="flex flex-col items-center gap-6 lg:sticky lg:top-8 lg:self-start">
                    <RadarChart categories={categories} scores={categoryScores} svgRef={radarRef} />
                    <div className="grid w-full grid-cols-2 gap-3 text-center">
                        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                            <p className="text-xs text-gray-500">Overall Maturity</p>
                            <p className={`font-serif text-3xl font-medium ${scoreColor(overallScore)}`}>
                                {overallScore}%
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                            <p className="text-xs text-gray-500">Compliance Readiness</p>
                            <p className={`font-serif text-3xl font-medium ${scoreColor(complianceScore)}`}>
                                {complianceScore}%
                            </p>
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-1.5">
                        {categories.map((cat, i) => (
                            <div key={cat.id} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-gray-800">
                                <span className="text-xs text-gray-600 dark:text-gray-400">{cat.shortLabel}</span>
                                <span className="text-sm font-medium">{Math.round(categoryScores[i] * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Priority Gaps */}
            {topGaps.length > 0 && (
                <div>
                    <h3 className="mb-4 font-serif text-xl font-medium">Gap Analysis</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {topGaps.map(({ label, gapItems }) => (
                            <div key={label} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                <h4 className="mb-3 text-sm font-medium">{label}</h4>
                                <ul className="flex flex-col gap-2">
                                    {gapItems.map(({ text, level }) => (
                                        <li key={text} className="flex items-start gap-2 text-xs">
                                            <span className={`mt-0.5 shrink-0 font-medium ${level === 0 ? 'text-red-500' : level === 1 ? 'text-orange-500' : 'text-yellow-600'}`}>
                                                {LEVELS[level]}
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {overallScore === 100 && (
                <p className="text-center font-medium text-green-600">
                    Your governance framework is fully mature — excellent work.
                </p>
            )}
        </div>
    );
}
