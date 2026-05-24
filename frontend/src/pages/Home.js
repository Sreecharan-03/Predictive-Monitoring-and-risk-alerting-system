import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaBolt, FaLeaf, FaArrowRight, FaDatabase, FaBrain, FaPlayCircle } from 'react-icons/fa';
import './Home.css';
import modelInfoMap from '../config/modelInfo';

function Home() {
  const stats = [
    { value: '6', label: 'trained models' },
    { value: '24/7', label: 'prediction access' },
    { value: '1 click', label: 'from input to insight' },
  ];

  const overview = [
    {
      title: 'One platform, six decision flows',
      description: 'The website groups six prediction models into one dashboard so teams can move from data entry to risk insight without jumping between tools.',
    },
    {
      title: 'Readable results, not raw numbers',
      description: 'Every model returns a prediction, a confidence score, a plain-language explanation, and a chart that helps people understand why the output matters.',
    },
    {
      title: 'Built for fast action',
      description: 'The UI is responsive on desktop and mobile, so operators, students, clinicians, and analysts can review predictions anywhere.',
    },
  ];

  const tasks = [
    {
      id: 1,
      title: 'Equipment Failure Predictor',
      description: 'Predict machine failures before they happen. AI-powered predictive maintenance system.',
      icon: <FaBolt />,
      path: '/equipment-failure',
      color: 'task-card-1',
      tag: 'Manufacturing',
    },
    {
      id: 2,
      title: 'System Performance Monitor',
      description: 'Monitor system metrics and predict potential downtime. Ensure maximum reliability.',
      icon: <FaChartLine />,
      path: '/system-performance',
      color: 'task-card-2',
      tag: 'Operations',
    },
    {
      id: 3,
      title: 'Student Performance Analyzer',
      description: 'Assess student dropout risk and intervention needs. Support educational success.',
      icon: <FaLeaf />,
      path: '/student-analyzer',
      color: 'task-card-3',
      tag: 'Education',
    },
    {
      id: 4,
      title: 'Patient Health Tracker',
      description: 'Monitor patient health and predict health risks. Improve healthcare outcomes.',
      icon: <FaShieldAlt />,
      path: '/health-tracker',
      color: 'task-card-4',
      tag: 'Healthcare',
    },
    {
      id: 5,
      title: 'Logistics Optimizer',
      description: 'Optimize supply chain and predict disruption risks. Streamline operations.',
      icon: <FaChartLine />,
      path: '/logistics',
      color: 'task-card-5',
      tag: 'Logistics',
    },
    {
      id: 6,
      title: 'Quality Control Monitor',
      description: 'Monitor manufacturing quality and detect defects early. Ensure excellence.',
      icon: <FaBolt />,
      path: '/quality-control',
      color: 'task-card-6',
      tag: 'Quality',
    },
  ];

  const modelAtlas = tasks.map((task) => ({
    title: task.title,
    tag: task.tag,
    description: modelInfoMap[
      task.title === 'Equipment Failure Predictor' ? 'Failure Risk Assessment'
        : task.title === 'System Performance Monitor' ? 'Performance Assessment'
        : task.title === 'Student Performance Analyzer' ? 'Student Risk Analysis'
        : task.title === 'Patient Health Tracker' ? 'Stroke Risk Analysis'
        : task.title === 'Logistics Optimizer' ? 'Disruption Risk Analysis'
        : 'Quality Risk'
    ],
    path: task.path,
  }));

  const workflowSteps = [
    'Open a model page and enter the values for that domain.',
    'The backend scores the model and returns prediction, confidence, and a human explanation.',
    'Review the chart and summary to understand whether the risk is low, medium, or high.',
  ];

  return (
    <div className="home-page fade-in">
      <section className="hero-shell">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="section-kicker">AI risk monitoring dashboard</span>
            <h1>
              A polished prediction platform for teams that need answers fast.
            </h1>
            <p className="hero-subtitle">
              Enter your values, get a model-backed decision, and read the result in a clean, professional interface inspired by modern product dashboards.
            </p>
            <div className="hero-actions">
              <Link to="/equipment-failure" className="btn btn-primary">
                <FaPlayCircle /> Open live models
              </Link>
              <a href="#tasks" className="btn btn-secondary">
                Browse all tasks <FaArrowRight />
              </a>
            </div>
            <div className="hero-highlights">
              <span><FaDatabase /> Real-time model scoring</span>
              <span><FaBrain /> Human-readable prediction text</span>
              <span><FaShieldAlt /> Responsive across desktop and mobile</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-panel hero-panel-main">
              <div className="panel-label">Live summary</div>
              <div className="panel-value">Predictive analytics</div>
              <div className="panel-subtitle">Clean inputs, fast scoring, confident results.</div>
            </div>
            <div className="hero-metric-grid">
              {stats.map((stat) => (
                <div className="hero-metric" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="tasks-section" id="tasks">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Models</span>
            <h2>Explore every prediction workflow</h2>
            <p>Each card opens a dedicated page with a form, a model-backed API call, and a polished result panel.</p>
          </div>

          <div className="tasks-grid">
            {tasks.map((task) => (
              <Link to={task.path} key={task.id} className={`task-card ${task.color}`}>
                <span className="task-tag">{task.tag}</span>
                <div className="task-icon">{task.icon}</div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-cta">Open model <FaArrowRight /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="overview-section">
        <div className="container">
          <div className="section-heading section-heading-left">
            <span className="section-kicker">About the website</span>
            <h2>Designed to explain the prediction, not just display it.</h2>
            <p>This dashboard is more than a form and a result box. It combines domain-specific models, visual feedback, and plain-language summaries so the output makes sense to non-technical users too.</p>
          </div>

          <div className="overview-grid">
            {overview.map((item) => (
              <article key={item.title} className="overview-card">
                <div className="overview-card-accent" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="model-atlas-section">
        <div className="container">
          <div className="section-heading section-heading-left">
            <span className="section-kicker">Model atlas</span>
            <h2>Every model, explained in one glance.</h2>
            <p>Each card below highlights the kind of risk it predicts and what the model is trying to protect.</p>
          </div>

          <div className="model-atlas-grid">
            {modelAtlas.map((model) => (
              <Link to={model.path} key={model.title} className="model-atlas-card">
                <span className="model-atlas-tag">{model.tag}</span>
                <h3>{model.title}</h3>
                <p>{model.description}</p>
                <div className="model-atlas-cta">See the model <FaArrowRight /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="workflow-section">
        <div className="container workflow-container">
          <div className="section-heading section-heading-left">
            <span className="section-kicker">How it works</span>
            <h2>From inputs to explanation in three steps.</h2>
          </div>

          <div className="workflow-grid">
            {workflowSteps.map((step, index) => (
              <div key={step} className="workflow-step">
                <div className="workflow-step-number">0{index + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-container">
          <div>
            <span className="section-kicker">Ready to use</span>
            <h2>Predict risks with a UI that feels built by a product team.</h2>
          </div>
          <Link to="/logistics" className="btn btn-large">
            Start with logistics
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
