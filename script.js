const QUESTIONS = [
  "Достигнув цели, ты почти сразу находишь, что могла сделать лучше?",
  "Ты часто оказываешься тем человеком, который решает чужие проблемы?",
  "Тебе сложно остановиться и отдыхать без чувства вины?",
  "Ты часто заранее отказываешься от того, что хочешь, чтобы не рисковать получить отказ?",
  "Ты часто прокручиваешь в голове худшие варианты развития событий?",
  "Тебе сложно принять решение, потому что всегда находится еще один аргумент за или против?",
  "Ты часто сравниваешь себя с другими и чувствуешь, что отстаешь?",
  "Тебе сложно сказать нет, даже когда ты не хочешь что-то делать?",
  "Тебе сложно попросить о помощи, даже когда тебе действительно тяжело?",
  "Ты иногда реагируешь на ситуацию сильнее, чем она объективно того требует?",
  "Ты оцениваешь свой день по тому, сколько успела сделать?",
  "Тебе сложно проявляться в полную силу там, где это могут достойно не оценить?",
  "Тебе сложно остаться в стороне, когда рядом кто-то в кризисе, даже если не просили о помощи?",
  "Тебе сложно показать другим неидеальный, черновой результат своей работы?",
  "Неопределенность (не знать, что будет) выбивает тебя из равновесия?",
  "Люди вокруг обычно не знают, насколько тебе на самом деле тяжело, потому что ты это не показываешь?",
  "Успех других людей чаще вызывает у тебя тревогу за себя, а не радость за них?",
  "Задним числом ты жалеешь о некоторых своих импульсивных словах или решениях?",
  "Ты обычно сначала думаешь о реакции других, а потом о своем желании?",
  "Ты можешь подолгу прокручивать одну ситуацию в голове, искать объяснение вместо действия?"
];

// question numbers are 1-indexed to match the key
const CRITICS = [
  { name: "Достигаторша", emoji: "🏆", questions: [3, 11],
    desc: "Меряет ценность дня и себя количеством сделанного, обесценивает уже достигнутое." },
  { name: "Королева сравнения", emoji: "👑", questions: [7, 17],
    desc: "Сверяется с чужими результатами и почти всегда находит, что отстаёт." },
  { name: "Перфекционистка", emoji: "🔍", questions: [1, 14],
    desc: "Не даёт показать неидеальный, черновой результат — и обесценивает готовый." },
  { name: "Хорошая девочка", emoji: "🎀", questions: [8, 19],
    desc: "Ставит чужие ожидания и реакции выше собственных желаний." },
  { name: "Тревожница", emoji: "🌪️", questions: [5, 15],
    desc: "Прокручивает худшие сценарии и плохо переносит неопределённость." },
  { name: "Королева драмы", emoji: "🎭", questions: [10, 18],
    desc: "Реагирует сильнее, чем требует ситуация, а потом жалеет об импульсивности." },
  { name: "Спасательница", emoji: "🛟", questions: [2, 13],
    desc: "Решает чужие проблемы и кризисы, даже когда её об этом не просили." },
  { name: "Аналитик", emoji: "🧩", questions: [6, 20],
    desc: "Ищет ещё один аргумент вместо решения, застревает в анализе одной ситуации." },
  { name: "Непобедимая супервумен", emoji: "🦸‍♀️", questions: [9, 16],
    desc: "Скрывает от других, насколько тяжело, и с трудом просит о помощи." },
  { name: "Королева отвержения", emoji: "🚪", questions: [4, 12],
    desc: "Заранее отказывается от желаемого и приглушает себя, чтобы не столкнуться с отказом или недооценкой." }
];

const state = {
  current: 0,
  answers: new Array(QUESTIONS.length).fill(null) // true = "да", false = "нет"
};

const screens = {
  intro: document.getElementById("screen-intro"),
  quiz: document.getElementById("screen-quiz"),
  results: document.getElementById("screen-results")
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function renderQuestion() {
  const idx = state.current;
  document.getElementById("question-number").textContent = `Вопрос ${idx + 1}`;
  document.getElementById("question-text").textContent = QUESTIONS[idx];
  document.getElementById("progress-label").textContent = `${idx + 1} / ${QUESTIONS.length}`;
  document.getElementById("progress-fill").style.width = `${((idx + 1) / QUESTIONS.length) * 100}%`;
  document.getElementById("btn-back").disabled = idx === 0;
}

function answer(value) {
  state.answers[state.current] = value;
  if (state.current < QUESTIONS.length - 1) {
    state.current += 1;
    renderQuestion();
  } else {
    showResults();
  }
}

function goBack() {
  if (state.current === 0) return;
  state.current -= 1;
  renderQuestion();
}

function computeResults() {
  return CRITICS.map(critic => {
    const yesCount = critic.questions.reduce((sum, qNum) => {
      return sum + (state.answers[qNum - 1] ? 1 : 0);
    }, 0);
    let level = "inactive";
    if (yesCount === 2) level = "strong";
    else if (yesCount === 1) level = "present";
    return { ...critic, yesCount, level };
  }).filter(c => c.level !== "inactive")
    .sort((a, b) => b.yesCount - a.yesCount);
}

function showResults() {
  const active = computeResults();
  const list = document.getElementById("results-list");
  list.innerHTML = "";

  const subtitle = document.getElementById("results-subtitle");
  if (active.length === 0) {
    subtitle.textContent = "Сегодня твои внутренние критики на удивление тихие.";
    list.innerHTML = `<div class="empty-state">Ни один критик не набрал достаточно «да» — редкий и хороший результат. Попробуй пройти тест ещё раз в другой день, состояние может меняться.</div>`;
  } else {
    subtitle.textContent = `Активных голосов: ${active.length}. Вот кто сейчас говорит громче всего.`;
    active.forEach(critic => {
      const card = document.createElement("div");
      card.className = `critic-card ${critic.level}`;
      const badge = critic.level === "strong"
        ? `<span class="badge badge-strong">Выражен явно</span>`
        : `<span class="badge badge-present">Присутствует</span>`;
      card.innerHTML = `
        <div class="critic-emoji">${critic.emoji}</div>
        <div class="critic-body">
          <div class="critic-top">
            <p class="critic-name">${critic.name}</p>
            ${badge}
          </div>
          <p class="critic-desc">${critic.desc}</p>
        </div>
      `;
      list.appendChild(card);
    });
  }

  showScreen("results");
}

function restart() {
  state.current = 0;
  state.answers.fill(null);
  renderQuestion();
  showScreen("quiz");
}

document.getElementById("btn-start").addEventListener("click", () => {
  renderQuestion();
  showScreen("quiz");
});
document.getElementById("btn-yes").addEventListener("click", () => answer(true));
document.getElementById("btn-no").addEventListener("click", () => answer(false));
document.getElementById("btn-back").addEventListener("click", goBack);
document.getElementById("btn-restart").addEventListener("click", restart);
