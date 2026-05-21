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

function RadarChart({ categories, scores }) {
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
        <svg viewBox="0 0 420 400" className="w-full max-w-sm mx-auto">
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
    const fileInputRef = useRef(null);

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
                .sort((a, b) => a.score - b.score)
                .slice(0, 3),
        [categories, categoryScores, answers]
    );

    const scoreColor = (score) =>
        score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="not-prose mt-6 flex flex-col gap-10">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-gray-50 px-4 py-2.5 text-xs text-gray-500 dark:bg-gray-800">
                <span>
                    <strong>Scale:</strong> 0 = None · 1 = Ad Hoc · 2 = Defined · 3 = Operational · 4 = Optimized
                </span>
                <span>
                    <span className="text-red-500">▲</span> Critical &nbsp;
                    <span className="text-orange-500">●</span> Regulated
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
                                    <li key={itemIdx} className="flex items-center gap-2">
                                        <div className="flex min-w-0 flex-1 items-start gap-1">
                                            {item.weight >= 3 && (
                                                <span className="mt-0.5 shrink-0 text-xs text-red-500">▲</span>
                                            )}
                                            {item.weight === 2 && (
                                                <span className="mt-0.5 shrink-0 text-xs text-orange-500">●</span>
                                            )}
                                            <span className="text-sm">{item.text}</span>
                                        </div>
                                        <MaturitySelector
                                            value={answers[catIdx][itemIdx]}
                                            onChange={(level) => setLevel(catIdx, itemIdx, level)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Radar + Scores */}
                <div className="flex flex-col items-center gap-6 lg:sticky lg:top-8 lg:self-start">
                    <RadarChart categories={categories} scores={categoryScores} />
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
                    <h3 className="mb-4 font-serif text-xl font-medium">Priority Gaps</h3>
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
