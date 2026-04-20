import React, { useMemo, useState } from "react";

const ICONS = [
  { id: "project", label: "프로젝트", emoji: "🗂️" },
  { id: "schedule", label: "공정표", emoji: "🧱" },
  { id: "calendar", label: "달력", emoji: "🗓️" },
  { id: "check", label: "체크", emoji: "✅" },
  { id: "questions", label: "질문", emoji: "💬" },
  { id: "warning", label: "경고", emoji: "⚠️" },
];

const STAGES = [
  { id: "extension", name: "구조 변경 / 확장공사", days: 4, tone: "dark" },
  { id: "planning", name: "기획 / 준비", days: 3, tone: "gray" },
  { id: "demolition", name: "철거", days: 2, tone: "gray" },
  { id: "plumbing", name: "설비", days: 3, tone: "blue" },
  { id: "electrical", name: "전기", days: 3, tone: "blue" },
  { id: "carpentry", name: "목공", days: 5, tone: "amber" },
  { id: "tile", name: "타일", days: 4, tone: "green" },
  { id: "wallpaper", name: "도배", days: 3, tone: "violet" },
  { id: "flooring", name: "바닥", days: 3, tone: "orange" },
  { id: "furniture", name: "가구 / 주방", days: 4, tone: "rose" },
  { id: "final", name: "최종 설치", days: 2, tone: "lime" },
  { id: "inspection", name: "입주 점검", days: 2, tone: "red" },
];

const DEFAULT_PROJECT = {
  name: "37평 아파트 전체 리모델링",
  homeType: "아파트",
  area: 37,
  scope: "전체 리모델링",
  bathrooms: 2,
  budget: 6000,
  startDate: "2026-04-07",
  hasExtension: true,
  hasKitchen: true,
  hasWindows: false,
  hasFurniture: true,
  hasHvac: true,
};

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function buildSchedule(startDate) {
  let cursor = new Date(startDate);
  return STAGES.map((stage) => {
    const start = new Date(cursor);
    const end = addDays(start, stage.days - 1);
    cursor = addDays(end, 1);
    return { ...stage, start, end };
  });
}
function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
function monthDays(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(start.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}
function stageForDate(date, schedule) {
  return schedule.find((stage) => date >= stage.start && date <= stage.end);
}
function toneClass(tone) {
  const map = {
    dark: "tone-dark", gray: "tone-gray", blue: "tone-blue", amber: "tone-amber",
    green: "tone-green", violet: "tone-violet", orange: "tone-orange", rose: "tone-rose",
    lime: "tone-lime", red: "tone-red",
  };
  return map[tone] || "tone-gray";
}

function AppIcon({ item, onClick }) {
  return (
    <button className="app-icon-card" onClick={onClick}>
      <div className="app-icon-badge">{item.emoji}</div>
      <div className="app-icon-label">{item.label}</div>
    </button>
  );
}

function CalendarPanel({ currentDate, setCurrentDate, schedule }) {
  const days = useMemo(() => monthDays(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);
  return (
    <div className="calendar-panel">
      <div className="calendar-head">
        <button className="nav-circle" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>‹</button>
        <div className="calendar-title">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</div>
        <button className="nav-circle" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>›</button>
      </div>

      <div className="week-header">
        {["일","월","화","수","목","금","토"].map((d) => <div key={d}>{d}</div>)}
      </div>

      <div className="calendar-grid">
        {days.map((day) => {
          const stage = stageForDate(day, schedule);
          const inMonth = day.getMonth() === currentDate.getMonth();
          return (
            <div key={day.toISOString()} className={`calendar-day ${inMonth ? "" : "is-dim"}`}>
              <div className="calendar-date">{day.getDate()}</div>
              {stage && <div className={`calendar-stage ${toneClass(stage.tone)}`}>{stage.name}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Header({ title, onHome }) {
  return (
    <div className="screen-header">
      <div className="screen-title">{title}</div>
      <button className="home-btn" onClick={onHome}>홈</button>
    </div>
  );
}
function Field({ label, children, wide = false }) {
  return (
    <div className={`field ${wide ? "wide" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
function CheckRow({ label, checked, onChange }) {
  return (
    <label className="check-row">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [project, setProject] = useState(DEFAULT_PROJECT);
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 3, 1));
  const schedule = useMemo(() => buildSchedule(project.startDate), [project.startDate]);

  const todaySummary = ["침대 위치 확정", "주방 콘센트 위치 검토", "타일 샘플 최종 선택"];
  const warnings = ["침대 위치 미확정 상태에서 전기 진행 금지", "확장공사 전 창호 사양 확정 필요"];

  return (
    <div className="app-shell">
      <div className="page-wrap">
        {screen === "home" && (
          <section className="home-screen">
            <div className="logo-area">
              <img src="/logo.png" alt="Reve Plate" className="main-logo" />
              <div className="tagline">반셀프 인테리어 솔루션</div>
            </div>

            <div className="home-grid-panel">
              <div className="icon-grid">
                {ICONS.map((item) => (
                  <AppIcon
                    key={item.id}
                    item={item}
                    onClick={() => {
                      if (item.id === "project") setScreen("project");
                      if (item.id === "schedule") setScreen("schedule");
                      if (item.id === "calendar") setScreen("calendar");
                      if (item.id === "check") setScreen("check");
                      if (item.id === "questions") setScreen("questions");
                      if (item.id === "warning") setScreen("warning");
                    }}
                  />
                ))}
              </div>
              <button className="primary-cta" onClick={() => setScreen("schedule")}>공정표 자동 생성하기</button>
            </div>
          </section>
        )}

        {screen === "project" && (
          <section className="content-screen">
            <Header title="프로젝트 만들기" onHome={() => setScreen("home")} />
            <div className="panel">
              <div className="form-grid">
                <Field label="프로젝트 이름"><input value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} /></Field>
                <Field label="집 유형">
                  <select value={project.homeType} onChange={(e) => setProject({ ...project, homeType: e.target.value })}>
                    <option>아파트</option><option>빌라</option><option>오피스텔</option><option>단독주택</option><option>상가</option>
                  </select>
                </Field>
                <Field label="평형"><input type="number" value={project.area} onChange={(e) => setProject({ ...project, area: Number(e.target.value) })} /></Field>
                <Field label="공사 범위">
                  <select value={project.scope} onChange={(e) => setProject({ ...project, scope: e.target.value })}>
                    <option>전체 리모델링</option><option>부분 리모델링</option><option>도배/바닥 중심</option>
                  </select>
                </Field>
                <Field label="욕실 개수"><input type="number" value={project.bathrooms} onChange={(e) => setProject({ ...project, bathrooms: Number(e.target.value) })} /></Field>
                <Field label="예산 (만원)"><input type="number" value={project.budget} onChange={(e) => setProject({ ...project, budget: Number(e.target.value) })} /></Field>
                <Field label="입주 예정일" wide><input type="date" value={project.startDate} onChange={(e) => setProject({ ...project, startDate: e.target.value })} /></Field>
              </div>

              <div className="sub-panel">
                <div className="sub-title">조건 선택</div>
                <div className="check-grid">
                  <CheckRow label="확장공사 있음" checked={project.hasExtension} onChange={(value) => setProject({ ...project, hasExtension: value })} />
                  <CheckRow label="주방 변경 있음" checked={project.hasKitchen} onChange={(value) => setProject({ ...project, hasKitchen: value })} />
                  <CheckRow label="창호 교체 있음" checked={project.hasWindows} onChange={(value) => setProject({ ...project, hasWindows: value })} />
                  <CheckRow label="제작가구 있음" checked={project.hasFurniture} onChange={(value) => setProject({ ...project, hasFurniture: value })} />
                  <CheckRow label="냉난방 변경 있음" checked={project.hasHvac} onChange={(value) => setProject({ ...project, hasHvac: value })} />
                </div>
              </div>
            </div>
          </section>
        )}

        {screen === "schedule" && (
          <section className="content-screen">
            <Header title="공정표" onHome={() => setScreen("home")} />
            <div className="two-col">
              <div className="panel">
                <div className="panel-title">단계별 공정표</div>
                <div className="stage-list">
                  {schedule.map((stage) => (
                    <div className="stage-card" key={stage.id}>
                      <div className="stage-card-top">
                        <div>
                          <div className="stage-name">{stage.name}</div>
                          <div className="stage-date">{formatDate(stage.start)} ~ {formatDate(stage.end)} · {stage.days}일</div>
                        </div>
                        <span className={`stage-badge ${toneClass(stage.tone)}`}>진행예정</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel">
                <div className="panel-title">달력으로 함께 보기</div>
                <CalendarPanel currentDate={calendarDate} setCurrentDate={setCalendarDate} schedule={schedule} />
              </div>
            </div>
          </section>
        )}

        {screen === "calendar" && (
          <section className="content-screen">
            <Header title="달력 보기" onHome={() => setScreen("home")} />
            <div className="panel">
              <CalendarPanel currentDate={calendarDate} setCurrentDate={setCalendarDate} schedule={schedule} />
            </div>
          </section>
        )}

        {screen === "check" && (
          <section className="content-screen">
            <Header title="오늘의 체크" onHome={() => setScreen("home")} />
            <div className="panel">
              <div className="panel-title">오늘 해야 할 일</div>
              <div className="list-stack">{todaySummary.map((item) => <div className="simple-card" key={item}>{item}</div>)}</div>
            </div>
          </section>
        )}

        {screen === "questions" && (
          <section className="content-screen">
            <Header title="질문 카드" onHome={() => setScreen("home")} />
            <div className="panel">
              <div className="panel-title">업체에게 물어볼 질문</div>
              <div className="list-stack">
                <div className="simple-card">콘센트 위치는 가구 기준으로 잡았나요?</div>
                <div className="simple-card">배수 기울기는 어떻게 확보하나요?</div>
                <div className="simple-card">간접조명 구조의 실제 깊이는 몇 mm인가요?</div>
              </div>
            </div>
          </section>
        )}

        {screen === "warning" && (
          <section className="content-screen">
            <Header title="위험 경고" onHome={() => setScreen("home")} />
            <div className="panel">
              <div className="panel-title">지금 확인해야 할 경고</div>
              <div className="list-stack">{warnings.map((item) => <div className="warning-card" key={item}>⚠ {item}</div>)}</div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
