const visualLabels = {
  speech: 'Speech / dialects',
  network: 'Services / replication',
  signal: 'Signal / model',
  activity: 'Activity / focus',
  dashboard: 'Tracking / insight',
};

const waveforms = [
  [8, 12, 18, 29, 18, 11, 24, 38, 26, 17, 9, 16, 28, 21, 12, 7, 19, 31, 20, 10],
  [9, 15, 23, 16, 35, 25, 14, 8, 18, 30, 39, 24, 13, 8, 20, 34, 19, 11, 18, 9],
  [7, 14, 20, 33, 25, 11, 18, 27, 16, 9, 24, 36, 22, 11, 7, 18, 31, 21, 12, 8],
];

function SpeechVisual() {
  return <>
    {waveforms.map((wave, row) => <g key={row}>
      <text className="visual-label" x="37" y={70 + row * 70}>{['NORTH', 'CENTRAL', 'SOUTH'][row]}</text>
      <line className="visual-rule" x1="125" x2="558" y1={79 + row * 70} y2={79 + row * 70} />
      {wave.map((height, index) => <rect className="visual-ink" key={index} x={132 + index * 20} y={79 + row * 70 - height / 2} width="5" height={height} rx="2.5" />)}
    </g>)}
  </>;
}

function NetworkVisual() {
  return <>
    <path className="visual-rule" d="M300 82 V113 M160 162 V189 M440 162 V189 M160 113 H440" />
    <path className="visual-rule" d="M160 113 V126 M440 113 V126" />
    <rect className="visual-box visual-main-box" x="239" y="39" width="122" height="43" rx="5" />
    <text className="visual-text" x="300" y="65" textAnchor="middle">controller</text>
    <rect className="visual-box" x="98" y="126" width="124" height="40" rx="5" />
    <rect className="visual-box" x="378" y="126" width="124" height="40" rx="5" />
    <text className="visual-text" x="160" y="151" textAnchor="middle">service 01</text>
    <text className="visual-text" x="440" y="151" textAnchor="middle">service 02</text>
    <rect className="visual-box visual-soft-box" x="98" y="189" width="124" height="40" rx="5" />
    <rect className="visual-box visual-soft-box" x="378" y="189" width="124" height="40" rx="5" />
    <text className="visual-text" x="160" y="214" textAnchor="middle">storage A</text>
    <text className="visual-text" x="440" y="214" textAnchor="middle">storage B</text>
    <path className="visual-accent-stroke" d="M222 209 H378" strokeDasharray="5 6" />
    <text className="visual-label" x="300" y="250" textAnchor="middle">REPLICATED</text>
  </>;
}

function SignalVisual() {
  return <>
    <text className="visual-label" x="37" y="48">INPUT SIGNAL</text>
    <path className="visual-rule" d="M37 123 H563" />
    <path className="visual-accent-stroke visual-signal" d="M37 123 H92 L106 116 L119 123 H176 L188 107 L200 139 L213 76 L226 156 L240 123 H305 L318 116 L331 123 H388 L400 107 L412 139 L425 76 L438 156 L452 123 H563" />
    <text className="visual-label" x="37" y="203">MODEL</text>
    <rect className="visual-box" x="114" y="185" width="169" height="35" rx="4" />
    <rect className="visual-box visual-main-box" x="317" y="185" width="169" height="35" rx="4" />
    <text className="visual-text" x="198" y="207" textAnchor="middle">baseline</text>
    <text className="visual-text" x="401" y="207" textAnchor="middle">compressed</text>
    <path className="visual-accent-stroke" d="M288 202 H312" />
    <path className="visual-accent-stroke" d="M304 196 L312 202 L304 208" />
  </>;
}

function ActivityVisual() {
  const bars = [32, 53, 38, 81, 56, 95, 72, 46, 71, 41, 29, 60];
  return <>
    <text className="visual-label" x="39" y="53">SESSION ACTIVITY</text>
    <line className="visual-rule" x1="39" x2="562" y1="205" y2="205" />
    {bars.map((height, index) => <rect className={index === 5 || index === 6 ? 'visual-ink' : 'visual-muted-fill'} key={index} x={58 + index * 43} y={205 - height} width="23" height={height} rx="3" />)}
    <text className="visual-label" x="40" y="243">TRACK</text>
    <text className="visual-label" x="265" y="243">CLASSIFY</text>
    <text className="visual-label" x="474" y="243">FOCUS</text>
    <path className="visual-accent-stroke" d="M93 235 H239 M327 235 H447" />
  </>;
}

function DashboardVisual() {
  return <>
    <rect className="visual-box" x="35" y="39" width="530" height="202" rx="5" />
    <path className="visual-rule" d="M35 80 H565 M375 80 V241" />
    <circle className="visual-ink" cx="57" cy="59" r="4" />
    <circle className="visual-muted-fill" cx="72" cy="59" r="4" />
    <circle className="visual-muted-fill" cx="87" cy="59" r="4" />
    <text className="visual-label" x="55" y="105">SPENDING OVER TIME</text>
    <path className="visual-rule" d="M57 202 H350" />
    <path className="visual-accent-stroke visual-chart" d="M57 187 L91 174 L124 182 L158 155 L192 163 L226 127 L259 139 L292 113 L329 122 L349 101" />
    <circle className="visual-ink" cx="349" cy="101" r="4" />
    <text className="visual-label" x="399" y="105">WIDGETS</text>
    <rect className="visual-soft-box" x="398" y="126" width="137" height="35" rx="3" />
    <rect className="visual-soft-box" x="398" y="174" width="137" height="35" rx="3" />
    <path className="visual-accent-stroke" d="M411 143 H467 M411 191 H493" />
  </>;
}

const visuals = {
  speech: SpeechVisual,
  network: NetworkVisual,
  signal: SignalVisual,
  activity: ActivityVisual,
  dashboard: DashboardVisual,
};

export const hasProjectVisual = (kind) => Boolean(visuals[kind]);

export default function ProjectVisual({ kind }) {
  const Visual = visuals[kind];
  if (!Visual) return null;
  return <div className="project-visual" aria-hidden="true">
    <div className="visual-heading"><span>Project schematic</span><span>{visualLabels[kind]}</span></div>
    <svg viewBox="0 0 600 280" role="presentation"><Visual /></svg>
  </div>;
}
