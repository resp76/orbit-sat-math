'use strict';

const STORAGE_KEY = 'orbitSatMathV1';

const DOMAINS = {
  algebra: { name: 'Algebra', short: 'Linear equations & functions', symbol: 'x', weight: 35 },
  advanced: { name: 'Advanced Math', short: 'Quadratics & nonlinear math', symbol: 'x²', weight: 35 },
  data: { name: 'Problem-Solving & Data', short: 'Rates, ratios & statistics', symbol: '%', weight: 15 },
  geometry: { name: 'Geometry & Trigonometry', short: 'Shapes, circles & triangles', symbol: '△', weight: 15 }
};

// These are original practice questions aligned to publicly described SAT Math skills.
// They are not copied from or endorsed by College Board.
const QUESTION_BANK = [
  {
    id: 'alg-01', domain: 'algebra', skill: 'Linear equations in one variable', difficulty: 'foundation', diagnostic: true,
    prompt: 'If 5x − 7 = 3x + 9, what is the value of x?',
    options: ['1', '4', '8', '16'], answer: 2,
    hint: 'Move both x terms to one side and both constants to the other.',
    explanation: 'Subtract 3x from both sides: 2x − 7 = 9. Add 7: 2x = 16, so x = 8.'
  },
  {
    id: 'alg-02', domain: 'algebra', skill: 'Slope and linear functions', difficulty: 'medium', diagnostic: true,
    prompt: 'A line passes through (2, 5) and (6, 17). Which equation represents the line?',
    options: ['y = 2x + 1', 'y = 3x − 1', 'y = 3x + 1', 'y = 4x − 3'], answer: 1,
    hint: 'First calculate slope using change in y divided by change in x.',
    explanation: 'The slope is (17 − 5)/(6 − 2) = 3. Using (2, 5): 5 = 3(2) + b, so b = −1. Therefore y = 3x − 1.'
  },
  {
    id: 'alg-03', domain: 'algebra', skill: 'Systems of equations', difficulty: 'medium',
    prompt: 'At a school play, adult tickets cost $12 and student tickets cost $7. A total of 85 tickets brought in $770. How many student tickets were sold?',
    options: ['35', '45', '50', '65'], answer: 2,
    hint: 'Let a + s = 85 and 12a + 7s = 770. Substitute a = 85 − s.',
    explanation: 'Substitute a = 85 − s: 12(85 − s) + 7s = 770. Then 1,020 − 5s = 770, so s = 50.'
  },
  {
    id: 'alg-04', domain: 'algebra', skill: 'Linear inequalities', difficulty: 'foundation',
    prompt: 'A streaming plan costs $18 per month plus $3 per movie. If Maya can spend at most $42, what is the greatest number of movies she can rent?',
    options: ['6', '8', '10', '14'], answer: 1,
    hint: 'Translate “at most” into the inequality 18 + 3m ≤ 42.',
    explanation: '18 + 3m ≤ 42 gives 3m ≤ 24, so m ≤ 8. The greatest whole number is 8.'
  },
  {
    id: 'alg-05', domain: 'algebra', skill: 'Interpreting linear models', difficulty: 'advanced',
    prompt: 'For the function f(t) = 72 − 4.5t, f(t) gives the liters of water left in a tank t minutes after draining begins. What does 4.5 represent?',
    options: ['The tank starts with 4.5 liters', 'The tank fills at 4.5 liters per minute', 'The tank drains at 4.5 liters per minute', 'The tank empties after 4.5 minutes'], answer: 2,
    hint: 'The coefficient of t is the rate of change. Pay attention to its sign.',
    explanation: 'The coefficient is −4.5, so the amount decreases by 4.5 liters each minute. The tank drains at 4.5 liters per minute.'
  },
  {
    id: 'adv-01', domain: 'advanced', skill: 'Quadratic equations', difficulty: 'foundation', diagnostic: true,
    prompt: 'Which values of x satisfy x² − 7x + 12 = 0?',
    options: ['−3 and −4', '3 and 4', '2 and 6', '−2 and −6'], answer: 1,
    hint: 'Find two numbers whose product is 12 and whose sum is −7 in the factored expression.',
    explanation: 'x² − 7x + 12 = (x − 3)(x − 4). Each factor can equal zero, giving x = 3 or x = 4.'
  },
  {
    id: 'adv-02', domain: 'advanced', skill: 'Exponential growth', difficulty: 'medium', diagnostic: true,
    prompt: 'A bacteria culture starts with 200 cells and doubles every 3 hours. Which expression gives the number of cells after h hours?',
    options: ['200(2)³ʰ', '200(2)ʰ⁄³', '200 + 2h/3', '200(3)ʰ⁄²'], answer: 1,
    hint: 'The exponent counts the number of 3-hour doubling periods.',
    explanation: 'After h hours, h/3 doubling periods have passed. The exponential model is 200(2)^(h/3).'
  },
  {
    id: 'adv-03', domain: 'advanced', skill: 'Equivalent expressions', difficulty: 'medium',
    prompt: 'Which expression is equivalent to (x² − 9)/(x − 3) for x ≠ 3?',
    options: ['x − 3', 'x + 3', 'x² + 3', '1'], answer: 1,
    hint: 'Factor the numerator as a difference of squares.',
    explanation: 'x² − 9 = (x − 3)(x + 3). Canceling x − 3, which is allowed because x ≠ 3, leaves x + 3.'
  },
  {
    id: 'adv-04', domain: 'advanced', skill: 'Vertex form', difficulty: 'advanced',
    prompt: 'The function g(x) = −2(x − 5)² + 18 models the height of an object. What is the maximum value of g(x)?',
    options: ['2', '5', '18', '23'], answer: 2,
    hint: 'This is vertex form. Because the squared term has a negative coefficient, the vertex is a maximum.',
    explanation: 'The vertex is (5, 18). Since the parabola opens downward, its maximum value is 18.'
  },
  {
    id: 'adv-05', domain: 'advanced', skill: 'Radical equations', difficulty: 'advanced',
    prompt: 'If √(x + 5) = x − 1, which value of x is a solution?',
    options: ['−1', '1', '4', '6'], answer: 2,
    hint: 'A square root is nonnegative. Test the choices in the original equation, not only a squared version.',
    explanation: 'For x = 4, √(4 + 5) = 3 and 4 − 1 = 3. The two sides are equal, so 4 is a solution.'
  },
  {
    id: 'data-01', domain: 'data', skill: 'Percent change', difficulty: 'foundation', diagnostic: true,
    prompt: 'A jacket originally priced at $80 is discounted by 25%. What is the sale price?',
    options: ['$20', '$55', '$60', '$75'], answer: 2,
    hint: 'A 25% discount means the buyer pays 75% of the original price.',
    explanation: 'The sale price is 0.75 × $80 = $60.'
  },
  {
    id: 'data-02', domain: 'data', skill: 'Ratios and units', difficulty: 'medium', diagnostic: true,
    prompt: 'A car travels 180 miles using 6 gallons of fuel. At the same rate, how many gallons are needed to travel 255 miles?',
    options: ['7.5', '8', '8.5', '9'], answer: 2,
    hint: 'First find miles per gallon, then divide 255 by that rate.',
    explanation: 'The car travels 180/6 = 30 miles per gallon. It needs 255/30 = 8.5 gallons.'
  },
  {
    id: 'data-03', domain: 'data', skill: 'Mean and totals', difficulty: 'medium',
    prompt: 'The mean of five numbers is 18. Four of the numbers are 12, 15, 20, and 24. What is the fifth number?',
    options: ['17', '18', '19', '21'], answer: 2,
    hint: 'The five numbers must have a total of 5 × 18.',
    explanation: 'The total is 90. The four known numbers total 71, so the fifth number is 90 − 71 = 19.'
  },
  {
    id: 'data-04', domain: 'data', skill: 'Probability', difficulty: 'advanced',
    prompt: 'A bag contains 5 blue, 3 green, and 2 yellow tiles. One tile is selected at random. What is the probability that it is not green?',
    options: ['3/10', '1/2', '7/10', '4/5'], answer: 2,
    hint: 'Count all tiles that are blue or yellow, then divide by the total.',
    explanation: 'There are 7 tiles that are not green out of 10 total tiles, so the probability is 7/10.'
  },
  {
    id: 'data-05', domain: 'data', skill: 'Scatterplots and models', difficulty: 'advanced',
    prompt: 'A line of best fit predicts y = 4.2x + 11. If the observed y-value when x = 10 is 49, what is the residual?',
    options: ['−4', '−2', '2', '4'], answer: 0,
    hint: 'Residual = observed value − predicted value.',
    explanation: 'The predicted value is 4.2(10) + 11 = 53. The residual is 49 − 53 = −4.'
  },
  {
    id: 'geo-01', domain: 'geometry', skill: 'Triangle area', difficulty: 'foundation', diagnostic: true,
    prompt: 'A triangle has a base of 12 centimeters and a height of 7 centimeters. What is its area in square centimeters?',
    options: ['19', '42', '84', '168'], answer: 1,
    hint: 'The area of a triangle is one-half times base times height.',
    explanation: 'Area = (1/2)(12)(7) = 42 square centimeters.'
  },
  {
    id: 'geo-02', domain: 'geometry', skill: 'Circles', difficulty: 'medium', diagnostic: true,
    prompt: 'A circle has circumference 18π. What is its radius?',
    options: ['4.5', '9', '18', '36'], answer: 1,
    hint: 'Use C = 2πr and solve for r.',
    explanation: '18π = 2πr. Dividing by 2π gives r = 9.'
  },
  {
    id: 'geo-03', domain: 'geometry', skill: 'Right triangles', difficulty: 'medium',
    prompt: 'A right triangle has legs of length 9 and 12. What is the length of its hypotenuse?',
    options: ['13', '15', '18', '21'], answer: 1,
    hint: 'Apply a² + b² = c².',
    explanation: '9² + 12² = 81 + 144 = 225. The square root of 225 is 15.'
  },
  {
    id: 'geo-04', domain: 'geometry', skill: 'Angle relationships', difficulty: 'advanced',
    prompt: 'Two parallel lines are cut by a transversal. One acute angle measures (3x + 8)°. One obtuse angle measures (7x − 8)°. What is x?',
    options: ['12', '16', '18', '22'], answer: 2,
    hint: 'An acute angle and an obtuse angle formed by the transversal are supplementary.',
    explanation: '(3x + 8) + (7x − 8) = 180, so 10x = 180 and x = 18.'
  },
  {
    id: 'geo-05', domain: 'geometry', skill: 'Right triangle trigonometry', difficulty: 'advanced',
    prompt: 'In a right triangle, sin θ = 3/5. If the side opposite θ has length 12, what is the length of the hypotenuse?',
    options: ['15', '18', '20', '24'], answer: 2,
    hint: 'sin θ = opposite/hypotenuse. Set 3/5 = 12/h.',
    explanation: '3/5 = 12/h. Cross-multiplying gives 3h = 60, so h = 20.'
  }
];

const DIAGNOSTIC_IDS = QUESTION_BANK.filter(question => question.diagnostic).map(question => question.id);
const questionById = id => QUESTION_BANK.find(question => question.id === id);

function createDefaultState() {
  return {
    profile: null,
    diagnostic: { completed: false, answers: [], completedAt: null },
    attempts: [],
    studyDays: {},
    sessionMinutes: 0,
    lastQuestionId: null
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return createDefaultState();
    return {
      ...createDefaultState(),
      ...saved,
      diagnostic: { ...createDefaultState().diagnostic, ...(saved.diagnostic || {}) },
      attempts: Array.isArray(saved.attempts) ? saved.attempts : [],
      studyDays: saved.studyDays && typeof saved.studyDays === 'object' ? saved.studyDays : {}
    };
  } catch (error) {
    console.warn('Orbit recovered from invalid saved progress.', error);
    return createDefaultState();
  }
}

let state = loadState();
let currentQuestion = null;
let selectedAnswer = null;
let questionAnswered = false;
let questionStartedAt = 0;
let timerInterval = null;
let diagnosticIndex = -1;
let diagnosticAnswers = [];
let toastTimeout = null;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function recordStudy(minutes = 2) {
  const key = todayKey();
  state.studyDays[key] = (state.studyDays[key] || 0) + minutes;
  state.sessionMinutes += minutes;
}

function domainStats(domain) {
  const attempts = state.attempts.filter(attempt => attempt.domain === domain);
  const correct = attempts.filter(attempt => attempt.correct).length;
  const diagnostic = state.diagnostic.answers.filter(answer => answer.domain === domain);
  const diagnosticCorrect = diagnostic.filter(answer => answer.correct).length;
  const total = attempts.length + diagnostic.length;
  const totalCorrect = correct + diagnosticCorrect;
  return { total, correct: totalCorrect, accuracy: total ? Math.round(totalCorrect / total * 100) : 0 };
}

function overallStats() {
  const practiceCorrect = state.attempts.filter(attempt => attempt.correct).length;
  const diagnosticCorrect = state.diagnostic.answers.filter(answer => answer.correct).length;
  const total = state.attempts.length + state.diagnostic.answers.length;
  return { total, correct: practiceCorrect + diagnosticCorrect, accuracy: total ? Math.round((practiceCorrect + diagnosticCorrect) / total * 100) : 0 };
}

function estimatedScore() {
  const start = state.profile?.startingScore || 540;
  const target = state.profile?.targetScore || 680;
  if (!state.diagnostic.completed) return start;
  const diagnosticRate = state.diagnostic.answers.filter(answer => answer.correct).length / Math.max(1, state.diagnostic.answers.length);
  const recent = state.attempts.slice(-24);
  const recentRate = recent.length ? recent.filter(attempt => attempt.correct).length / recent.length : diagnosticRate;
  const evidence = Math.min(1, (state.diagnostic.answers.length + recent.length) / 28);
  const skillLift = Math.max(0, ((recentRate * .65 + diagnosticRate * .35) - .42) * 235);
  const estimate = start + skillLift * evidence;
  return Math.round(clamp(estimate, 200, Math.max(target + 30, start)) / 10) * 10;
}

function daysUntilTest() {
  if (!state.profile?.testDate) return null;
  const target = new Date(`${state.profile.testDate}T12:00:00`);
  return Math.max(0, Math.ceil((target - new Date()) / 86400000));
}

function activeStreak() {
  let streak = 0;
  const cursor = new Date();
  if (!state.studyDays[todayKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
  while (state.studyDays[todayKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2300);
}

function routeTo(route) {
  const valid = ['home', 'practice', 'review', 'progress'];
  const next = valid.includes(route) ? route : 'home';
  document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === `view-${next}`));
  document.querySelectorAll('[data-route]').forEach(button => {
    const active = button.dataset.route === next;
    button.classList.toggle('active', active);
    if (button.classList.contains('nav-button')) active ? button.setAttribute('aria-current', 'page') : button.removeAttribute('aria-current');
  });
  if (location.hash !== `#${next}`) history.replaceState(null, '', `#${next}`);
  document.querySelector('#profile-panel').hidden = true;
  document.querySelector('#profile-button').setAttribute('aria-expanded', 'false');
  if (next === 'home') renderHome();
  if (next === 'review') renderReview();
  if (next === 'progress') renderProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('#main-content').focus({ preventScroll: true });
}

function renderHome() {
  const profile = state.profile || { name: 'Student', startingScore: 540, targetScore: 680 };
  const estimate = estimatedScore();
  const pointsToGo = Math.max(0, profile.targetScore - estimate);
  const progress = profile.targetScore === profile.startingScore ? 100 : clamp((estimate - profile.startingScore) / (profile.targetScore - profile.startingScore) * 100, 0, 100);
  const days = daysUntilTest();
  const weakest = Object.keys(DOMAINS).sort((a, b) => domainStats(a).accuracy - domainStats(b).accuracy)[0];
  const hasData = state.diagnostic.completed || state.attempts.length;

  document.querySelector('#profile-initial').textContent = profile.name.slice(0, 1).toUpperCase();
  document.querySelector('#home-title').textContent = `Let’s build your next ${Math.max(0, profile.targetScore - profile.startingScore)} points, ${profile.name}.`;
  document.querySelector('#home-lede').textContent = days === null ? 'Short, focused practice based on what you need most.' : days === 0 ? 'Test day is here. Keep today light and trust your preparation.' : `${days} day${days === 1 ? '' : 's'} until test day. Small focused sessions add up.`;
  document.querySelector('#goal-current').textContent = profile.startingScore;
  document.querySelector('#goal-target').textContent = profile.targetScore;
  document.querySelector('#estimated-score').textContent = estimate;
  document.querySelector('#points-to-go').textContent = pointsToGo ? `${pointsToGo} points to go` : 'Goal range reached';
  document.querySelector('#score-message').textContent = !state.diagnostic.completed ? 'Complete the diagnostic to calibrate your plan.' : state.attempts.length < 8 ? 'Keep practicing so this estimate has more evidence.' : 'Use Bluebook for an official scored checkpoint.';
  document.querySelector('#trend-badge').textContent = estimate > profile.startingScore ? `+${estimate - profile.startingScore} estimated` : 'Baseline';
  document.querySelector('#score-track-fill').style.width = `${progress}%`;
  document.querySelector('#score-ring').style.setProperty('--score-angle', `${Math.max(18, progress * 3.6)}deg`);
  document.querySelector('#track-start').textContent = `${profile.startingScore} start`;
  document.querySelector('#track-goal').textContent = `${profile.targetScore} goal`;

  const missionTitle = state.diagnostic.completed ? `Strengthen ${DOMAINS[weakest].name}` : 'Find your starting point';
  const missionCopy = state.diagnostic.completed ? `Your current practice shows the biggest opportunity in ${DOMAINS[weakest].short.toLowerCase()}. Orbit will start there and adjust as you improve.` : 'Take an 8-question diagnostic so Orbit can build a study path around your strengths and gaps.';
  document.querySelector('#mission-title').textContent = missionTitle;
  document.querySelector('#mission-copy').textContent = missionCopy;
  document.querySelector('#mission-button').innerHTML = state.diagnostic.completed ? 'Start focused practice <span aria-hidden="true">→</span>' : 'Start diagnostic <span aria-hidden="true">→</span>';

  document.querySelector('#focus-grid').innerHTML = Object.entries(DOMAINS).map(([id, domain]) => {
    const stats = domainStats(id);
    const description = stats.total ? `${stats.accuracy}% accuracy · ${stats.total} answered` : domain.short;
    return `<button class="focus-card ${hasData && id === weakest ? 'recommended' : ''}" type="button" data-focus-domain="${id}">
      ${hasData && id === weakest ? '<span class="recommend-label">Best next step</span>' : ''}
      <span class="domain-symbol" aria-hidden="true">${domain.symbol}</span><strong>${domain.name}</strong><small>${description}</small>
    </button>`;
  }).join('');

  renderWeek();
}

function renderWeek() {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - now.getDay());
  let weekMinutes = 0;
  document.querySelector('#week-dots').innerHTML = labels.map((label, index) => {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + index);
    const minutes = state.studyDays[todayKey(day)] || 0;
    weekMinutes += minutes;
    return `<span class="day-dot ${minutes ? 'done' : ''}"><i>${minutes ? '✓' : ''}</i>${label}</span>`;
  }).join('');
  const streak = activeStreak();
  document.querySelector('#streak-count').textContent = streak ? `${streak}-day study streak` : 'Start your streak';
  document.querySelector('#weekly-minutes').textContent = weekMinutes;
}

function practicePool() {
  const mode = document.querySelector('input[name="practice-mode"]:checked')?.value || 'adaptive';
  const domain = document.querySelector('#domain-select').value;
  let pool = QUESTION_BANK.filter(question => domain === 'all' || question.domain === domain);
  if (mode === 'mistakes') {
    const missedIds = new Set(state.attempts.filter(attempt => !attempt.correct).map(attempt => attempt.questionId));
    pool = pool.filter(question => missedIds.has(question.id));
    if (!pool.length) {
      showToast('No missed questions in that selection yet. Starting a smart mix instead.');
      pool = QUESTION_BANK.filter(question => domain === 'all' || question.domain === domain);
    }
  }
  if (mode === 'adaptive' && domain === 'all') {
    const domains = Object.keys(DOMAINS).sort((a, b) => {
      const aStats = domainStats(a);
      const bStats = domainStats(b);
      const aScore = aStats.total ? aStats.accuracy : 45;
      const bScore = bStats.total ? bStats.accuracy : 45;
      return aScore - bScore;
    });
    const priority = domains.slice(0, 2);
    pool = pool.filter(question => priority.includes(question.domain));
  }
  return pool;
}

function chooseQuestion(preferredId = null) {
  clearInterval(timerInterval);
  const pool = practicePool();
  if (!pool.length) return;
  const recentIds = new Set(state.attempts.slice(-5).map(attempt => attempt.questionId));
  const fresh = pool.filter(question => !recentIds.has(question.id) && question.id !== state.lastQuestionId);
  const candidates = fresh.length ? fresh : pool.filter(question => question.id !== state.lastQuestionId);
  currentQuestion = preferredId ? questionById(preferredId) : (candidates.length ? candidates : pool)[Math.floor(Math.random() * (candidates.length || pool.length))];
  selectedAnswer = null;
  questionAnswered = false;
  questionStartedAt = Date.now();
  state.lastQuestionId = currentQuestion.id;
  saveState();
  renderQuestion();
  startTimer();
}

function renderQuestion() {
  if (!currentQuestion) return;
  const domain = DOMAINS[currentQuestion.domain];
  const letters = ['A', 'B', 'C', 'D'];
  document.querySelector('#question-card').innerHTML = `
    <div class="question-meta"><span>${domain.name} · ${escapeHtml(currentQuestion.skill)}</span><span class="difficulty">${currentQuestion.difficulty}</span><span class="question-timer" id="question-timer">0:00</span></div>
    <h2 class="question-prompt">${escapeHtml(currentQuestion.prompt)}</h2>
    <div class="options" role="radiogroup" aria-label="Answer choices">
      ${currentQuestion.options.map((option, index) => `<button class="option" type="button" role="radio" aria-checked="false" data-answer="${index}"><span class="option-letter">${letters[index]}</span><span>${escapeHtml(option)}</span></button>`).join('')}
    </div>
    <div id="question-support" aria-live="polite"></div>
    <div class="question-actions"><button class="hint-button" type="button" id="show-hint">Give me a hint</button><button class="primary-button" type="button" id="check-answer" disabled>Check answer</button></div>`;
}

function startTimer() {
  const timed = document.querySelector('#timer-toggle').checked;
  const timer = document.querySelector('#question-timer');
  if (!timer) return;
  timer.hidden = !timed;
  if (!timed) return;
  const update = () => {
    const seconds = Math.floor((Date.now() - questionStartedAt) / 1000);
    timer.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    timer.style.color = seconds > 95 ? 'var(--red)' : '';
  };
  update();
  timerInterval = setInterval(update, 1000);
}

function selectAnswer(index) {
  if (questionAnswered) return;
  selectedAnswer = index;
  document.querySelectorAll('.option').forEach((option, optionIndex) => {
    const active = optionIndex === index;
    option.classList.toggle('selected', active);
    option.setAttribute('aria-checked', String(active));
  });
  document.querySelector('#check-answer').disabled = false;
}

function showHint() {
  if (!currentQuestion || questionAnswered) return;
  document.querySelector('#question-support').innerHTML = `<div class="hint-box"><strong>Tutor hint</strong>${escapeHtml(currentQuestion.hint)}</div>`;
  document.querySelector('#show-hint').disabled = true;
}

function submitAnswer() {
  if (!currentQuestion || selectedAnswer === null || questionAnswered) return;
  clearInterval(timerInterval);
  questionAnswered = true;
  const correct = selectedAnswer === currentQuestion.answer;
  const seconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
  state.attempts.push({ questionId: currentQuestion.id, domain: currentQuestion.domain, skill: currentQuestion.skill, correct, selected: selectedAnswer, seconds, date: new Date().toISOString() });
  recordStudy(2);
  saveState();
  document.querySelectorAll('.option').forEach((option, index) => {
    option.disabled = true;
    if (index === currentQuestion.answer) option.classList.add('correct');
    if (index === selectedAnswer && !correct) option.classList.add('incorrect');
  });
  document.querySelector('#question-support').innerHTML = `<div class="feedback-box ${correct ? 'correct' : 'incorrect'}"><strong>${correct ? 'Nice work.' : 'Good miss—this is where growth happens.'}</strong>${escapeHtml(currentQuestion.explanation)}</div>`;
  const actions = document.querySelector('.question-actions');
  actions.innerHTML = `<span class="question-meta">${seconds}s · ${correct ? 'Correct' : 'Review saved'}</span><button class="primary-button" type="button" id="next-question">Next question →</button>`;
}

function outstandingMistakes() {
  const status = new Map();
  state.attempts.forEach(attempt => status.set(attempt.questionId, attempt));
  return [...status.values()].filter(attempt => !attempt.correct).reverse();
}

function renderReview() {
  const mistakes = outstandingMistakes();
  const totalMisses = state.attempts.filter(attempt => !attempt.correct).length;
  const resolved = new Set(state.attempts.filter(attempt => attempt.correct).map(attempt => attempt.questionId));
  const fastestOpportunity = Object.keys(DOMAINS).sort((a, b) => domainStats(a).accuracy - domainStats(b).accuracy)[0];
  document.querySelector('#review-summary').innerHTML = `
    <article class="summary-card"><strong>${mistakes.length}</strong><small>Ready to retry</small></article>
    <article class="summary-card"><strong>${totalMisses}</strong><small>Total misses studied</small></article>
    <article class="summary-card"><strong>${resolved.size}</strong><small>Questions recovered</small></article>
    <article class="summary-card"><strong>${DOMAINS[fastestOpportunity].name}</strong><small>Best growth area</small></article>`;
  const container = document.querySelector('#mistake-list');
  if (!mistakes.length) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon" aria-hidden="true">✓</span><h2>Your review queue is clear</h2><p>Missed practice questions will appear here with the concept and explanation.</p><button class="primary-button" type="button" data-route="practice">Start practice</button></div>`;
    return;
  }
  container.innerHTML = mistakes.map(attempt => {
    const question = questionById(attempt.questionId);
    if (!question) return '';
    return `<article class="mistake-item"><div><span class="mistake-domain">${DOMAINS[question.domain].name} · ${escapeHtml(question.skill)}</span><h3>${escapeHtml(question.prompt)}</h3><p>${escapeHtml(question.explanation)}</p></div><button class="secondary-button" type="button" data-retry="${question.id}">Retry question</button></article>`;
  }).join('');
}

function renderProgress() {
  const stats = overallStats();
  const averageSeconds = state.attempts.length ? Math.round(state.attempts.reduce((sum, attempt) => sum + (attempt.seconds || 0), 0) / state.attempts.length) : 0;
  const totalMinutes = Object.values(state.studyDays).reduce((sum, minutes) => sum + Number(minutes || 0), 0);
  document.querySelector('#metrics-grid').innerHTML = `
    <article class="metric-card"><strong>${estimatedScore()}</strong><small>Estimated level</small></article>
    <article class="metric-card"><strong>${stats.accuracy}%</strong><small>Overall accuracy</small></article>
    <article class="metric-card"><strong>${averageSeconds || '—'}${averageSeconds ? 's' : ''}</strong><small>Average pace</small></article>
    <article class="metric-card"><strong>${totalMinutes}</strong><small>Minutes practiced</small></article>`;
  document.querySelector('#domain-progress-list').innerHTML = Object.entries(DOMAINS).map(([id, domain]) => {
    const stats = domainStats(id);
    return `<div class="domain-progress-row"><strong>${domain.name}</strong><div class="progress-bar"><i style="width:${stats.accuracy}%"></i></div><span>${stats.total ? `${stats.accuracy}%` : 'Not started'}</span></div>`;
  }).join('');
  const history = [
    ...state.diagnostic.answers.length ? [{ date: state.diagnostic.completedAt, name: 'SAT Math diagnostic', result: `${state.diagnostic.answers.filter(item => item.correct).length}/${state.diagnostic.answers.length}`, good: true }] : [],
    ...state.attempts.slice(-12).reverse().map(attempt => ({ date: attempt.date, name: questionById(attempt.questionId)?.skill || 'Practice question', result: attempt.correct ? 'Correct' : 'Review', good: attempt.correct }))
  ];
  document.querySelector('#history-list').innerHTML = history.length ? history.map(item => `<div class="history-row"><time>${new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time><strong>${escapeHtml(item.name)}</strong><span class="history-result ${item.good ? 'good' : ''}">${item.result}</span></div>`).join('') : '<div class="empty-state">Complete the diagnostic or a practice question to start your history.</div>';
}

function openDiagnostic() {
  diagnosticIndex = -1;
  diagnosticAnswers = [];
  renderDiagnostic();
  document.querySelector('#diagnostic-dialog').showModal();
}

function renderDiagnostic() {
  const container = document.querySelector('#diagnostic-content');
  if (diagnosticIndex === -1) {
    container.innerHTML = `<div class="diagnostic-intro"><span class="empty-icon" aria-hidden="true">8</span><span class="eyebrow">Quick calibration</span><h1 id="diagnostic-title">Find the skills behind the score.</h1><p>Answer 8 original SAT-style questions—two from each math domain. Take your best shot and use scratch paper. There is no penalty for guessing.</p><button class="primary-button" type="button" id="begin-diagnostic">Begin diagnostic</button></div>`;
    return;
  }
  if (diagnosticIndex >= DIAGNOSTIC_IDS.length) {
    finishDiagnostic();
    return;
  }
  const question = questionById(DIAGNOSTIC_IDS[diagnosticIndex]);
  container.innerHTML = `<div class="diagnostic-header"><span class="diagnostic-count">Question ${diagnosticIndex + 1} of ${DIAGNOSTIC_IDS.length}</span><div class="diagnostic-progress"><i style="width:${(diagnosticIndex / DIAGNOSTIC_IDS.length) * 100}%"></i></div><button class="close-button" type="button" id="close-diagnostic" aria-label="Close diagnostic">×</button></div>
    <span class="eyebrow">${DOMAINS[question.domain].name}</span><h2 class="question-prompt" id="diagnostic-title">${escapeHtml(question.prompt)}</h2>
    <div class="options" role="radiogroup" aria-label="Diagnostic answer choices">${question.options.map((option, index) => `<button class="option" type="button" role="radio" aria-checked="false" data-diagnostic-answer="${index}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`).join('')}</div>
    <div class="question-actions"><span class="question-meta">Choose your best answer</span><button class="primary-button" type="button" id="diagnostic-next" disabled>${diagnosticIndex === DIAGNOSTIC_IDS.length - 1 ? 'See my plan' : 'Next question'} →</button></div>`;
}

function selectDiagnosticAnswer(index) {
  document.querySelectorAll('[data-diagnostic-answer]').forEach((option, optionIndex) => {
    option.classList.toggle('selected', optionIndex === index);
    option.setAttribute('aria-checked', String(optionIndex === index));
  });
  document.querySelector('#diagnostic-next').disabled = false;
  document.querySelector('#diagnostic-next').dataset.answer = String(index);
}

function advanceDiagnostic() {
  const selected = Number(document.querySelector('#diagnostic-next').dataset.answer);
  const question = questionById(DIAGNOSTIC_IDS[diagnosticIndex]);
  diagnosticAnswers.push({ questionId: question.id, domain: question.domain, correct: selected === question.answer, selected });
  diagnosticIndex += 1;
  renderDiagnostic();
}

function finishDiagnostic() {
  state.diagnostic = { completed: true, answers: diagnosticAnswers, completedAt: new Date().toISOString() };
  recordStudy(12);
  saveState();
  const correct = diagnosticAnswers.filter(answer => answer.correct).length;
  const weakest = Object.keys(DOMAINS).sort((a, b) => {
    const rate = domain => {
      const items = diagnosticAnswers.filter(answer => answer.domain === domain);
      return items.filter(answer => answer.correct).length / items.length;
    };
    return rate(a) - rate(b);
  })[0];
  document.querySelector('#diagnostic-content').innerHTML = `<div class="diagnostic-results"><span class="eyebrow">Plan calibrated</span><h1 id="diagnostic-title">Your starting path is ready.</h1><div class="diagnostic-score"><strong>${correct}/8</strong><small>diagnostic</small></div><p>Start with <strong>${DOMAINS[weakest].name}</strong>, then build breadth across all four domains.</p><div class="result-domains">${Object.entries(DOMAINS).map(([id, domain]) => {
    const items = diagnosticAnswers.filter(answer => answer.domain === id);
    const count = items.filter(answer => answer.correct).length;
    return `<div class="result-domain"><strong>${domain.name}</strong><small>${count} of ${items.length} correct</small></div>`;
  }).join('')}</div><button class="primary-button" type="button" id="finish-diagnostic">Start my first focused drill</button></div>`;
}

function completeOnboarding() {
  const name = document.querySelector('#learner-name').value.trim();
  const startingScore = Number(document.querySelector('#starting-score').value);
  const targetScore = Number(document.querySelector('#target-score').value);
  if (!name || startingScore < 200 || startingScore > 800 || targetScore < 200 || targetScore > 800) return false;
  state.profile = { name, startingScore, targetScore, testDate: document.querySelector('#test-date').value };
  saveState();
  document.querySelector('#onboarding-dialog').close();
  populateSettings();
  renderHome();
  showToast(`Welcome to Orbit, ${name}.`);
  return true;
}

function populateSettings() {
  if (!state.profile) return;
  document.querySelector('#learner-name-setting').value = state.profile.name;
  document.querySelector('#test-date-setting').value = state.profile.testDate || '';
  document.querySelector('#start-score-setting').value = state.profile.startingScore;
  document.querySelector('#goal-score-setting').value = state.profile.targetScore;
}

function saveSettings() {
  const name = document.querySelector('#learner-name-setting').value.trim();
  const startingScore = Number(document.querySelector('#start-score-setting').value);
  const targetScore = Number(document.querySelector('#goal-score-setting').value);
  if (!name || startingScore < 200 || startingScore > 800 || targetScore < 200 || targetScore > 800) {
    showToast('Enter a name and Math scores from 200 to 800.');
    return;
  }
  state.profile = { name, startingScore, targetScore, testDate: document.querySelector('#test-date-setting').value };
  saveState();
  document.querySelector('#profile-panel').hidden = true;
  document.querySelector('#profile-button').setAttribute('aria-expanded', 'false');
  renderHome();
  showToast('Study plan updated.');
}

function handleClick(event) {
  const route = event.target.closest('[data-route]');
  if (route) return routeTo(route.dataset.route);

  if (event.target.closest('[data-next-onboarding]')) {
    const name = document.querySelector('#learner-name');
    if (!name.reportValidity()) return;
    document.querySelector('[data-onboarding-step="1"]').classList.remove('active');
    document.querySelector('[data-onboarding-step="2"]').classList.add('active');
    return;
  }
  if (event.target.closest('[data-prev-onboarding]')) {
    document.querySelector('[data-onboarding-step="2"]').classList.remove('active');
    document.querySelector('[data-onboarding-step="1"]').classList.add('active');
    return;
  }
  if (event.target.closest('#profile-button')) {
    const panel = document.querySelector('#profile-panel');
    panel.hidden = !panel.hidden;
    event.target.closest('#profile-button').setAttribute('aria-expanded', String(!panel.hidden));
    return;
  }
  if (event.target.closest('[data-close-profile]')) {
    document.querySelector('#profile-panel').hidden = true;
    document.querySelector('#profile-button').setAttribute('aria-expanded', 'false');
    return;
  }
  if (event.target.closest('#save-settings')) return saveSettings();
  if (event.target.closest('#reset-data')) {
    if (!confirm('Erase all Orbit learner settings and study history from this device?')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = createDefaultState();
    location.reload();
    return;
  }
  if (event.target.closest('#mission-button')) return state.diagnostic.completed ? (routeTo('practice'), chooseQuestion()) : openDiagnostic();
  if (event.target.closest('#open-diagnostic')) return openDiagnostic();
  if (event.target.closest('#begin-diagnostic')) { diagnosticIndex = 0; renderDiagnostic(); return; }
  if (event.target.closest('#close-diagnostic')) { document.querySelector('#diagnostic-dialog').close(); return; }
  const diagnosticAnswer = event.target.closest('[data-diagnostic-answer]');
  if (diagnosticAnswer) return selectDiagnosticAnswer(Number(diagnosticAnswer.dataset.diagnosticAnswer));
  if (event.target.closest('#diagnostic-next')) return advanceDiagnostic();
  if (event.target.closest('#finish-diagnostic')) {
    document.querySelector('#diagnostic-dialog').close();
    const weakest = Object.keys(DOMAINS).sort((a, b) => domainStats(a).accuracy - domainStats(b).accuracy)[0];
    document.querySelector('#domain-select').value = weakest;
    routeTo('practice');
    chooseQuestion();
    return;
  }
  const focus = event.target.closest('[data-focus-domain]');
  if (focus) {
    document.querySelector('#domain-select').value = focus.dataset.focusDomain;
    routeTo('practice');
    chooseQuestion();
    return;
  }
  if (event.target.closest('#new-question') || event.target.closest('[data-start-practice]') || event.target.closest('#next-question')) return chooseQuestion();
  const answer = event.target.closest('[data-answer]');
  if (answer) return selectAnswer(Number(answer.dataset.answer));
  if (event.target.closest('#show-hint')) return showHint();
  if (event.target.closest('#check-answer')) return submitAnswer();
  const retry = event.target.closest('[data-retry]');
  if (retry) { routeTo('practice'); chooseQuestion(retry.dataset.retry); return; }
  if (event.target.closest('#print-progress')) return window.print();
}

function init() {
  document.addEventListener('click', handleClick);
  document.querySelector('#onboarding-form').addEventListener('submit', event => {
    event.preventDefault();
    completeOnboarding();
  });
  window.addEventListener('hashchange', () => routeTo(location.hash.slice(1)));
  document.addEventListener('keydown', event => {
    if (!currentQuestion || questionAnswered || !document.querySelector('#view-practice').classList.contains('active')) return;
    const number = Number(event.key);
    if (number >= 1 && number <= 4) selectAnswer(number - 1);
  });
  populateSettings();
  renderHome();
  renderReview();
  renderProgress();
  routeTo(location.hash.slice(1) || 'home');
  if (!state.profile) document.querySelector('#onboarding-dialog').showModal();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('./sw.js').catch(() => {});
}

init();
