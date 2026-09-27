import {
  INDONESIA_SPACE_ARTICLES,
  INDONESIAN_SPACE_MILESTONES,
  QUIZ_QUESTIONS,
  QuizQuestion
} from '../data/indonesiaSpace';
import { CurriculumLevel } from '../data/planets';
import { t, getLanguage } from '../utils/i18n';

export class IndonesiaSpacePanel {
  public container: HTMLElement;
  private currentTab: 'palapa' | 'bosscha' | 'equator' | 'timau' | 'timeline' | 'quiz' = 'palapa';
  public curriculumLevel: CurriculumLevel = 'smp';

  // Quiz state
  private quizQuestions: QuizQuestion[] = [];
  private currentQuestionIndex: number = 0;
  private selectedAnswerIndex: number | null = null;
  private quizScore: number = 0;
  private quizCompleted: boolean = false;

  public onClose?: () => void;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'indonesia-panel glass-panel hidden';
    this.container.setAttribute('aria-label', 'Indonesia dan Antariksa');

    this.initQuiz();
    this.render();
  }

  show(tab?: 'palapa' | 'bosscha' | 'equator' | 'timau' | 'timeline' | 'quiz'): void {
    if (tab) this.currentTab = tab;
    this.container.classList.remove('hidden');
    this.render();
  }

  hide(): void {
    this.container.classList.add('hidden');
    if (this.onClose) this.onClose();
  }

  setCurriculumLevel(level: CurriculumLevel): void {
    this.curriculumLevel = level;
    this.initQuiz();
    this.render();
  }

  refreshLanguage(): void {
    if (!this.container.classList.contains('hidden')) {
      this.render();
    }
  }

  private initQuiz(): void {
    this.quizQuestions = QUIZ_QUESTIONS.filter(q => {
      if (this.curriculumLevel === 'sd') return q.level === 'sd';
      if (this.curriculumLevel === 'smp') return q.level === 'sd' || q.level === 'smp';
      return true;
    });
    this.currentQuestionIndex = 0;
    this.selectedAnswerIndex = null;
    this.quizScore = 0;
    this.quizCompleted = false;
  }

  private render(): void {
    const isEn = getLanguage() === 'en';
    const tr = t();

    this.container.innerHTML = `
      <div class="panel-header">
        <div class="header-titles">
          <div class="header-badges">
            <span class="badge badge-indonesia">${tr.idSpaceBadge}</span>
            <span class="badge badge-curriculum">${tr.levelPrefix}: ${this.curriculumLevel.toUpperCase()}</span>
          </div>
          <h2 class="planet-title">${tr.idSpaceTitle}</h2>
          <span class="planet-subtitle">${tr.idSpaceSubtitle}</span>
        </div>
        <button class="btn-close" id="btn-close-id" title="${isEn ? 'Close' : 'Tutup'}">&times;</button>
      </div>

      <!-- Navigation Tabs -->
      <div class="panel-tabs">
        <button class="tab-btn ${this.currentTab === 'palapa' ? 'active' : ''}" data-tab="palapa">${tr.tabPalapa}</button>
        <button class="tab-btn ${this.currentTab === 'bosscha' ? 'active' : ''}" data-tab="bosscha">${tr.tabBosscha}</button>
        <button class="tab-btn ${this.currentTab === 'equator' ? 'active' : ''}" data-tab="equator">${tr.tabEquator}</button>
        <button class="tab-btn ${this.currentTab === 'timau' ? 'active' : ''}" data-tab="timau">${tr.tabTimau}</button>
        <button class="tab-btn ${this.currentTab === 'timeline' ? 'active' : ''}" data-tab="timeline">${tr.tabTimeline}</button>
        <button class="tab-btn ${this.currentTab === 'quiz' ? 'active' : ''}" data-tab="quiz">${tr.tabQuiz}</button>
      </div>

      <div class="indonesia-content">
        ${this.renderActiveTabContent()}
      </div>
    `;

    this.attachEvents();
  }

  private renderActiveTabContent(): string {
    switch (this.currentTab) {
      case 'palapa':
        return this.renderArticle(INDONESIA_SPACE_ARTICLES.palapa);
      case 'bosscha':
        return this.renderArticle(INDONESIA_SPACE_ARTICLES.bosscha);
      case 'equator':
        return this.renderArticle(INDONESIA_SPACE_ARTICLES.equatorialAdvantage);
      case 'timau':
        return this.renderArticle(INDONESIA_SPACE_ARTICLES.timau);
      case 'timeline':
        return this.renderTimeline();
      case 'quiz':
        return this.renderQuiz();
    }
  }

  private renderArticle(article: {
    title: string;
    titleEn?: string;
    subtitle: string;
    subtitleEn?: string;
    icon: string;
    content: string;
    contentEn?: string;
    stats: { label: string; value: string }[];
    statsEn?: { label: string; value: string }[];
  }): string {
    const isEn = getLanguage() === 'en';
    const title = isEn && article.titleEn ? article.titleEn : article.title;
    const subtitle = isEn && article.subtitleEn ? article.subtitleEn : article.subtitle;
    const content = isEn && article.contentEn ? article.contentEn : article.content;
    const stats = isEn && article.statsEn ? article.statsEn : article.stats;

    return `
      <div class="article-wrapper">
        <div class="article-header">
          <span class="article-icon">${article.icon}</span>
          <div>
            <h3>${title}</h3>
            <p class="article-subtitle">${subtitle}</p>
          </div>
        </div>

        <div class="stats-row">
          ${stats.map(s => `
            <div class="stat-card">
              <span class="stat-label">${s.label}</span>
              <strong class="stat-value">${s.value}</strong>
            </div>
          `).join('')}
        </div>

        <div class="article-body">
          ${content.replace(/\n\n/g, '<p></p>').replace(/### (.*?)\n/g, '<h4>$1</h4>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
        </div>
      </div>
    `;
  }

  private renderTimeline(): string {
    const isEn = getLanguage() === 'en';

    return `
      <div class="timeline-wrapper">
        <h3 class="timeline-title">${isEn ? 'Milestones in Indonesian Space Exploration History' : 'Lini Masa Tonggak Sejarah Antariksa Indonesia'}</h3>
        <div class="timeline-list">
          ${INDONESIAN_SPACE_MILESTONES.map(m => {
            const title = isEn && m.titleEn ? m.titleEn : m.title;
            const desc = isEn && m.descriptionEn ? m.descriptionEn : m.description;
            const sig = isEn && m.significanceEn ? m.significanceEn : m.significance;
            const det = isEn && m.detailsEn ? m.detailsEn : m.details;

            return `
              <div class="timeline-item">
                <div class="timeline-year">${m.year}</div>
                <div class="timeline-content">
                  <h4>${title}</h4>
                  <p class="timeline-desc">${desc}</p>
                  <div class="timeline-significance">
                    <strong>${isEn ? 'Significance:' : 'Arti Penting:'}</strong> ${sig}
                  </div>
                  <small class="timeline-details">${det}</small>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  private renderQuiz(): string {
    const isEn = getLanguage() === 'en';
    const tr = t();

    if (this.quizCompleted) {
      const pct = Math.round((this.quizScore / this.quizQuestions.length) * 100);
      return `
        <div class="quiz-completed-box">
          <div class="quiz-trophy">${pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : '📚'}</div>
          <h3>${tr.quizCompletedTitle}</h3>
          <p class="score-display">${tr.quizScoreLabel}: <strong>${this.quizScore} / ${this.quizQuestions.length} (${pct}%)</strong></p>
          <p class="score-message">
            ${pct >= 80 ? (isEn ? 'Outstanding! Your grasp of astronomy and celestial mechanics is top-notch!' : 'Luar biasa! Pemahamanmu tentang astronomi dan sains antariksa sangat mantap!') :
              pct >= 60 ? (isEn ? 'Great job! You understand core physics principles of our solar system.' : 'Bagus sekali! Kamu sudah memahami konsep dasar fisika tata surya.') :
              (isEn ? 'Keep learning! Re-explore the planets and try guided experiments in the 3D lab.' : 'Tetap semangat! Jelajahi lagi materi dan lakukan eksperimen di Tata Surya 3D.')}
          </p>
          <button class="btn-retry-quiz" id="btn-quiz-retry">${tr.btnRetryQuiz}</button>
        </div>
      `;
    }

    if (this.quizQuestions.length === 0) {
      return `<p class="text-muted">${isEn ? 'No quiz questions available for this level.' : 'Tidak ada pertanyaan kuis untuk kategori ini.'}</p>`;
    }

    const q = this.quizQuestions[this.currentQuestionIndex];
    const qText = isEn && q.questionEn ? q.questionEn : q.question;
    const qOpts = isEn && q.optionsEn ? q.optionsEn : q.options;
    const qExpl = isEn && q.explanationEn ? q.explanationEn : q.explanation;

    return `
      <div class="quiz-box">
        <div class="quiz-progress-row">
          <span>${isEn ? `Question ${this.currentQuestionIndex + 1} of ${this.quizQuestions.length}` : `Pertanyaan ${this.currentQuestionIndex + 1} dari ${this.quizQuestions.length}`}</span>
          <span class="score-pill">${isEn ? `Score: ${this.quizScore}` : `Skor: ${this.quizScore}`}</span>
        </div>

        <h3 class="quiz-question-text">${qText}</h3>

        <div class="quiz-options-list">
          ${qOpts.map((opt, idx) => {
            let stateClass = '';
            if (this.selectedAnswerIndex !== null) {
              if (idx === q.correctIndex) stateClass = 'correct';
              else if (idx === this.selectedAnswerIndex) stateClass = 'incorrect';
            }
            return `
              <button class="btn-quiz-opt ${stateClass}" data-idx="${idx}" ${this.selectedAnswerIndex !== null ? 'disabled' : ''}>
                <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="opt-content">${opt}</span>
              </button>
            `;
          }).join('')}
        </div>

        ${this.selectedAnswerIndex !== null ? `
          <div class="quiz-explanation-box">
            <strong>${this.selectedAnswerIndex === q.correctIndex ? tr.correctFeedback : tr.explanationTitle}</strong>
            <p>${qExpl}</p>
            <button class="btn-next-question" id="btn-quiz-next">
              ${this.currentQuestionIndex < this.quizQuestions.length - 1 ? tr.btnNextQuestion : (isEn ? 'View Final Results 🏁' : 'Lihat Hasil Akhir 🏁')}
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  private attachEvents(): void {
    const closeBtn = this.container.querySelector('#btn-close-id');
    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());

    // Tab buttons
    const tabs = this.container.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = (e.currentTarget as HTMLElement).getAttribute('data-tab') as any;
        if (tabName) {
          this.currentTab = tabName;
          this.render();
        }
      });
    });

    // Quiz events
    if (this.currentTab === 'quiz') {
      const optBtns = this.container.querySelectorAll('.btn-quiz-opt');
      optBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          if (this.selectedAnswerIndex !== null) return;
          const idx = parseInt((e.currentTarget as HTMLElement).dataset.idx || '0', 10);
          this.selectedAnswerIndex = idx;
          const q = this.quizQuestions[this.currentQuestionIndex];
          if (idx === q.correctIndex) {
            this.quizScore += 10;
          }
          this.render();
        });
      });

      const nextBtn = this.container.querySelector('#btn-quiz-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.selectedAnswerIndex = null;
            this.render();
          } else {
            this.quizCompleted = true;
            this.render();
          }
        });
      }

      const retryBtn = this.container.querySelector('#btn-quiz-retry');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          this.initQuiz();
          this.render();
        });
      }
    }
  }
}
