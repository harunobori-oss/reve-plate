import React, { useMemo, useState } from "react";

const STAGE_LIBRARY = [
  {
    id: "extension",
    name: "0단계. 구조 변경 / 확장공사",
    short: "확장공사",
    order: 0,
    includeWhen: (p) => p.hasExtension,
    duration: (p) => 3 + (p.area >= 35 ? 2 : 1),
    overview:
      "확장공사는 단순히 공간을 넓히는 작업이 아니라 단열, 결로, 창호, 난방, 구조 안정성까지 영향을 주는 선행 단계입니다.",
    decisions: ["발코니 확장 여부", "철거 예정 벽의 구조벽 여부", "창호 교체 여부", "단열 방식과 범위"],
    standards: ["외벽 단열 보강: 보통 50~100mm 검토", "결로 취약부: 창 주변, 외벽 코너, 슬라브 접합부", "창호는 이중창 이상과 로이유리 적용 검토"],
    checklist: ["내력벽 여부 확인 완료", "관리사무소/현장 승인 여부 확인", "창호 사양 확정", "단열 방식 결정", "확장 후 바닥 단차 검토"],
    questions: ["이 벽은 철거 가능한 구조인가요?", "창 주변 열교 차단은 어떻게 처리하나요?", "확장 후 결로 가능성이 가장 큰 부위는 어디인가요?"],
    good: ["단열이 끊기지 않고 이어진다", "창 주변과 코너부 상세가 명확하다"],
    bad: ["문제 없다는 말만 하고 구조 설명이 없다", "결로 가능성 설명이 없다"],
    risks: ["결로", "곰팡이", "난방비 증가", "창 주변 하자"],
  },
  {
    id: "planning",
    name: "1단계. 기획 / 준비",
    short: "기획/준비",
    order: 1,
    includeWhen: () => true,
    duration: (p) => (p.scope === "full" ? 3 : 2),
    overview:
      "기획 단계는 공사 품질을 미리 결정하는 단계입니다. 예산, 범위, 가구 배치, 일정이 흐리면 뒤 공정에서 비용과 시간이 샙니다.",
    decisions: ["총예산", "공사 범위", "스타일 방향", "가구/가전 배치", "입주 일정"],
    standards: ["예비비 10~15% 별도 확보 권장", "실측은 가로/세로/높이/창/문/콘센트 위치까지 확보", "가구는 실제 제품 치수 기준 검토"],
    checklist: ["예산 상한선 확정", "가구/가전 리스트 작성", "실측 완료", "유지/철거 구분 완료", "현장 사진 기록 완료"],
    questions: ["이 예산에서 반드시 포기해야 할 항목은 무엇인가요?", "추가 비용이 가장 자주 발생하는 공정은 어디인가요?", "가구 배치가 전기/설비에 반영되나요?"],
    good: ["실측과 배치가 예산과 연결된다", "남길 것과 바꿀 것이 명확하다"],
    bad: ["예쁜 이미지부터 고른다", "가구 위치 없이 공사를 논의한다"],
    risks: ["예산 초과", "공사 중 반복 변경", "사용성 불만족"],
  },
  {
    id: "demolition",
    name: "2단계. 철거",
    short: "철거",
    order: 2,
    includeWhen: () => true,
    duration: (p) => (p.area >= 35 ? 3 : 2),
    overview:
      "철거는 단순 파괴가 아니라 숨겨진 조건을 드러내는 단계입니다. 보존할 것을 지키면서 드러낼 것을 정확히 드러내야 합니다.",
    decisions: ["철거 범위", "보존 부위", "철거 후 추가 보수 허용 범위"],
    standards: ["욕실 철거 후 방수/배수 상태 확인", "바닥 철거 후 단차/크랙/습기 점검", "샷시, 현관문, 공용부 보호 계획 필요"],
    checklist: ["비철거 부위 표시 완료", "보호 양생 완료", "폐기물 처리 계획 확인", "철거 후 바탕 상태 확인"],
    questions: ["철거 후 추가 보수가 필요하면 사진으로 설명해주시나요?", "난방배관과 급배수배관 손상 위험 구간은 어디인가요?"],
    good: ["철거 후 상태 설명이 구체적이다", "보존 부위 손상이 없다"],
    bad: ["원래 다 그렇다고만 말한다", "보호 작업이 약하다"],
    risks: ["배관 손상", "추가비용", "보존 부위 손상"],
  },
  {
    id: "plumbing",
    name: "3단계. 설비 (급배수)",
    short: "설비",
    order: 3,
    includeWhen: (p) => p.scope === "full" || p.bathroomCount > 0 || p.hasKitchenChange,
    duration: (p) => 1 + p.bathroomCount + (p.hasKitchenChange ? 1 : 0),
    overview:
      "설비는 생활 만족도와 하자율을 크게 좌우하는 공정입니다. 수정 비용이 커서 선결정이 중요합니다.",
    decisions: ["싱크 높이", "세면대 높이", "수전 위치", "세탁/건조 배치"],
    standards: ["세면대 높이: 보통 800~850mm", "싱크 상판 높이: 보통 850~900mm", "배수 기울기: 최소 1/50 수준 검토"],
    checklist: ["세면대 높이 검토", "싱크 높이 검토", "배수 기울기 확인", "세탁기/건조기 배관 위치 확인", "욕실 바닥 배수 방향 검토"],
    questions: ["이 배관 위치로 유지보수 가능한가요?", "배수 기울기는 어떻게 확보하나요?", "악취 방지 처리는 어떻게 하나요?"],
    good: ["가전과 가구 내부 구조까지 반영된다", "사용자의 키와 습관이 반영된다"],
    bad: ["설치만 되면 된다는 접근", "수전/거울/선반 간섭 검토가 없다"],
    risks: ["물 고임", "악취", "누수", "재시공 비용 증가"],
  },
  {
    id: "electrical",
    name: "4단계. 전기",
    short: "전기",
    order: 4,
    includeWhen: () => true,
    duration: (p) => (p.area >= 35 ? 3 : 2),
    overview:
      "전기는 생활 방식의 지도를 만드는 단계입니다. 콘센트와 스위치 위치는 미관보다 사용성이 우선입니다.",
    decisions: ["침대 위치", "TV 위치", "주방 가전 구성", "조명 회로 분리", "공유기 위치"],
    standards: ["일반 콘센트 높이: 250~300mm", "일반 스위치 높이: 1100~1200mm", "주방 상판 위 콘센트: 1100~1200mm 내외"],
    checklist: ["침대 양옆 충전 위치 확보", "TV 벽면 전원/통신 위치 확보", "주방 소형가전 위치 반영", "로봇청소기 자리 확보", "조명 회로 분리 검토"],
    questions: ["콘센트 위치는 가구 배치를 기준으로 잡았나요?", "주방은 어떤 기준으로 전원 분리를 하나요?", "간접조명 전원과 스위치는 어떻게 연결되나요?"],
    good: ["멀티탭이 거의 필요 없게 설계된다", "조명과 스위치가 동선상 자연스럽다"],
    bad: ["벽마다 일정 간격으로만 배치한다", "주방 사용 패턴을 반영하지 않는다"],
    risks: ["멀티탭 남발", "차단기 문제", "스위치 사용 불편"],
  },
  {
    id: "carpentry",
    name: "5단계. 목공",
    short: "목공",
    order: 5,
    includeWhen: (p) => p.scope === "full" || p.hasCustomFurniture,
    duration: (p) => 3 + (p.area >= 35 ? 2 : 1) + (p.hasExtension ? 1 : 0),
    overview:
      "목공은 공간의 골격을 잡는 공정입니다. 천장, 몰딩, 커튼박스, 간접조명 구조, 가벽, 수납 형상이 여기서 결정됩니다.",
    decisions: ["평천장/단차천장", "간접조명 여부", "몰딩 최소화 여부", "가벽 설치 여부"],
    standards: ["간접조명 깊이: 최소 80mm, 권장 100~120mm", "커튼박스 깊이: 최소 120mm, 권장 150mm 이상", "옷장 깊이: 보통 550~600mm"],
    checklist: ["간접조명 구조 깊이 확인", "커튼박스 깊이 확인", "천장 단차와 에어컨 간섭 검토", "점검구 위치 정리", "몰딩/문선/걸레받이 스타일 통일"],
    questions: ["간접조명 구조의 실제 깊이와 턱 높이는 얼마인가요?", "전동커튼 모터까지 고려되어 있나요?", "점검구는 어디에 들어가고 얼마나 보이나요?"],
    good: ["조명·커튼·에어컨·수납과 논리적으로 연결된다"],
    bad: ["간접조명 구조가 너무 얕다", "수납은 큰데 실제로 쓰기 불편하다"],
    risks: ["조명 품질 저하", "수납 불편", "유지보수 어려움"],
  },
  {
    id: "windows",
    name: "6단계. 창호 / 문 / 단열 보완",
    short: "창호/문",
    order: 6,
    includeWhen: (p) => p.hasWindowChange || p.hasExtension,
    duration: () => 2,
    overview:
      "창호와 문은 차음, 기밀, 냉난방 효율을 좌우합니다. 보이지 않아도 쾌적성을 결정하는 공정입니다.",
    decisions: ["창 교체 여부", "문 교체 여부", "방음/차음 우선순위", "단열 보강 범위"],
    standards: ["문 하부 틈과 바닥마감 두께를 함께 검토", "창 개폐 방향과 가구 간섭 확인"],
    checklist: ["창 개폐 방향과 가구 간섭 검토", "방충망/손잡이/잠금장치 품질 확인", "문 하부 틈 검토", "창 주변 마감선 확인"],
    questions: ["창호 기밀 성능은 어느 정도인가요?", "문틀 교체 없이 문만 바꾸면 한계가 있나요?", "방문 하부 틈은 어느 정도로 계획하나요?"],
    good: ["열고 닫는 감각이 안정적이다", "벽·바닥·문틀 접합부가 깔끔하다"],
    bad: ["창 주변 실리콘과 마감선이 조악하다", "단열 설명이 없다"],
    risks: ["소음", "결로", "냉난방 효율 저하"],
  },
  {
    id: "tile",
    name: "7단계. 타일",
    short: "타일",
    order: 7,
    includeWhen: (p) => p.scope === "full" || p.bathroomCount > 0 || p.hasKitchenChange,
    duration: (p) => Math.max(2, p.bathroomCount * 2 + (p.hasKitchenChange ? 1 : 0)),
    overview:
      "타일은 내구성, 위생, 물 관리, 고급감을 동시에 결정하는 공정입니다.",
    decisions: ["타일 크기", "줄눈 폭/색상", "코너 마감 방식", "무광/유광"],
    standards: ["일반 줄눈: 보통 2~3mm", "욕실 바닥 구배는 물이 자연스럽게 배수구로 흐를 정도 확보"],
    checklist: ["타일 패턴 시작점 확인", "욕실 바닥 물 고임 테스트", "코너 마감 확인", "줄눈 색상 검토"],
    questions: ["바닥 구배는 어떤 기준으로 잡으셨나요?", "물 고임 테스트는 어떻게 확인하나요?", "코너는 어떤 방식으로 마감하나요?"],
    good: ["가까이서 줄과 면이 안정적이다", "물이 잘 빠진다"],
    bad: ["줄눈 폭이 들쑥날쑥하다", "코너가 날카롭다"],
    risks: ["물 고임", "곰팡이", "들뜸", "깨짐"],
  },
  {
    id: "painting",
    name: "8단계. 도장",
    short: "도장",
    order: 8,
    includeWhen: (p) => p.scope === "full",
    duration: () => 2,
    overview:
      "도장은 색을 입히는 것이 아니라 질감과 완성도를 만드는 공정입니다.",
    decisions: ["도장 범위", "광도", "컬러 샘플", "문/몰딩 도장 여부"],
    standards: ["보통 2~3회 이상 도장 검토", "샘플 확인 없이 본시공 진행은 위험"],
    checklist: ["실제 샘플 확인", "낮/밤 조명 아래 색감 확인", "모서리/문선 접합부 점검"],
    questions: ["샘플 시공 후 본시공에 들어갈 수 있나요?", "문짝과 몰딩 도장은 현장인지 공장인지요?"],
    good: ["면이 안정적이고 질감이 일정하다"],
    bad: ["롤러 자국이 많다", "보수 흔적이 크게 남는다"],
    risks: ["색상 오판", "얼룩", "재도장 비용"],
  },
  {
    id: "wallpaper",
    name: "9단계. 도배",
    short: "도배",
    order: 9,
    includeWhen: (p) => p.scope === "full" || p.scope === "surface",
    duration: (p) => (p.area >= 35 ? 3 : 2),
    overview:
      "도배는 벽면을 덮는 작업이 아니라 공간의 표정을 정리하는 공정입니다.",
    decisions: ["벽지 종류", "톤", "방별 통일 여부", "벽/천장 동일 톤 여부"],
    standards: ["측면광에서 울렁임이 적어야 함", "이음새와 코너 마감이 눈에 과하게 띄지 않아야 함"],
    checklist: ["벽지 샘플을 실제 조명 아래 확인", "창 주변/코너 이음새 확인", "측면광에서 면 상태 확인"],
    questions: ["기존 바탕면 상태가 도배 품질에 영향을 주나요?", "퍼티/면정리 범위는 어디까지 하나요?"],
    good: ["가까이서도 이음새와 울렁임이 적다"],
    bad: ["낮에는 괜찮고 밤 조명 아래 울렁인다"],
    risks: ["면불량", "이음선 노출", "재도배 비용"],
  },
  {
    id: "flooring",
    name: "10단계. 바닥 마감",
    short: "바닥",
    order: 10,
    includeWhen: (p) => p.scope === "full" || p.scope === "surface",
    duration: (p) => (p.area >= 35 ? 3 : 2),
    overview:
      "바닥은 면적이 커서 공간 분위기를 가장 강하게 좌우합니다.",
    decisions: ["바닥재 종류", "톤", "걸레받이 방식", "방별 동일 마감 여부"],
    standards: ["바닥재 두께는 문 하부와 함께 검토", "전체 톤 통일이 공간 확장감에 유리한 경우 많음"],
    checklist: ["문 하부와 바닥재 두께 간섭 확인", "바닥 톤과 문/벽/가구 조합 검토", "걸레받이 방식 확인"],
    questions: ["문 하부 컷팅이 필요한가요?", "덧방인지 철거 후 시공인지요?", "시공 후 단차 문제는 없나요?"],
    good: ["걸레받이와 문 하부 정리가 깔끔하다"],
    bad: ["문이 바닥에 걸린다", "끝선 정리가 거칠다"],
    risks: ["들뜸", "단차", "톤 미스매치"],
  },
  {
    id: "furniture",
    name: "11단계. 가구 / 수납 / 주방",
    short: "가구/주방",
    order: 11,
    includeWhen: (p) => p.hasCustomFurniture || p.hasKitchenChange || p.scope === "full",
    duration: (p) => 2 + (p.hasCustomFurniture ? 2 : 1) + (p.hasKitchenChange ? 1 : 0),
    overview:
      "가구는 마지막에 들어오지만 실제 생활 만족도를 결정하는 핵심 공정입니다.",
    decisions: ["붙박이장 구성", "주방 상하부장 구성", "서랍/여닫이 비율", "상판 재질"],
    standards: ["옷장 깊이: 550~600mm", "신발장 깊이: 300~350mm", "주방 상판 높이: 850~900mm"],
    checklist: ["옷 길이에 맞는 행거 높이 검토", "소형가전 수납 위치 결정", "냉장고/오븐/식세기 치수 반영", "서랍 동선 간섭 점검"],
    questions: ["내부 구성은 생활 패턴에 맞게 바꿀 수 있나요?", "가전 치수를 반영해서 제작하시나요?", "하드웨어는 어떤 등급을 쓰나요?"],
    good: ["열고 쓰기 편하다", "가전과 구조가 자연스럽게 맞물린다"],
    bad: ["예쁜데 실제로 물건이 안 들어간다", "식세기/냉장고 문 간섭이 난다"],
    risks: ["수납 부족", "사용 불편", "가전 간섭", "납기 지연"],
  },
  {
    id: "final_install",
    name: "12단계. 조명 / 냉난방 / 최종 설치",
    short: "최종설치",
    order: 12,
    includeWhen: () => true,
    duration: (p) => 2 + (p.hasHvacChange ? 1 : 0),
    overview:
      "조명과 냉난방, 최종 설치는 공간의 분위기와 실제 불편을 결정하는 마감 단계입니다.",
    decisions: ["색온도", "주/보조/간접조명 비율", "에어컨 방식", "바람 방향"],
    standards: ["거실 조명 색온도: 보통 3000~4000K 검토", "조명은 한 가지 밝은 조명보다 레이어 구성 권장", "에어컨은 침대/소파 직격을 피하도록 검토"],
    checklist: ["공간별 색온도 정리", "식탁 조명 중심선 확인", "간접조명 눈부심 확인", "시스템에어컨 점검구 위치 확인", "스위치와 조명 동선 최종 확인"],
    questions: ["이 조명은 눈부심이 어느 정도인가요?", "간접조명 광원 교체가 가능한 구조인가요?", "에어컨 배수와 점검구는 어떻게 처리되나요?"],
    good: ["분위기와 사용성을 같이 잡는다"],
    bad: ["색온도가 제각각이다", "주조명만 너무 밝다"],
    risks: ["눈 피로", "분위기 저하", "에어컨 사용 불편"],
  },
  {
    id: "inspection",
    name: "13단계. 입주 점검",
    short: "입주점검",
    order: 13,
    includeWhen: () => true,
    duration: () => 2,
    overview:
      "입주 점검은 하자를 발견할 수 있는 마지막 기회입니다. 작동과 사용성을 중심으로 기록하며 확인해야 합니다.",
    decisions: ["즉시 보수 항목", "추후 보수 항목", "입주 전 잔여 이슈"],
    standards: ["배수는 실제로 물을 흘려보며 확인", "조명은 낮과 밤 모두 확인", "하자는 사진 + 위치 + 증상으로 기록"],
    checklist: ["모든 문 개폐 확인", "전 콘센트 통전 테스트", "조명 스위치 연결 확인", "급배수 테스트", "실리콘/도배/도장/바닥 스크래치 확인", "가구 수평과 서랍 레일 확인"],
    questions: ["오늘 바로 보수 가능한 항목과 추후 보수 항목을 나눠주실 수 있나요?", "자연스러운 현상과 하자를 구분해주실 수 있나요?"],
    good: ["작동과 사용성을 먼저 본다", "하자를 기록으로 남긴다"],
    bad: ["멀리서 전체만 보고 끝낸다", "사진 없이 말로만 전달한다"],
    risks: ["하자 누락", "보수 지연", "입주 후 불편"],
  },
];

const DEFAULT_FORM = {
  name: "37평 아파트 전체 리모델링",
  houseType: "아파트",
  area: 37,
  scope: "full",
  bathroomCount: 2,
  budget: 6000,
  moveInDate: "",
  hasExtension: true,
  hasKitchenChange: true,
  hasWindowChange: false,
  hasCustomFurniture: true,
  hasHvacChange: true,
};

function generateStages(project) {
  const included = STAGE_LIBRARY
    .filter((stage) => stage.includeWhen(project))
    .sort((a, b) => a.order - b.order);

  let dayCursor = 1;
  return included.map((stage) => {
    const duration = stage.duration(project);
    const startDay = dayCursor;
    const endDay = startDay + duration - 1;
    dayCursor = endDay + 1;
    return {
      ...stage,
      durationDays: duration,
      startDay,
      endDay,
      completedChecklist: {},
      notes: "",
    };
  });
}

function stageCompletion(stage) {
  const total = stage.checklist.length;
  const done = Object.values(stage.completedChecklist || {}).filter(Boolean).length;
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function overallCompletion(stages) {
  const all = stages.flatMap((s) => s.checklist.map((_, i) => !!s.completedChecklist?.[i]));
  if (!all.length) return 0;
  return Math.round((all.filter(Boolean).length / all.length) * 100);
}

function stageState(stage) {
  const percent = stageCompletion(stage);
  if (percent === 100) return "done";
  if (percent > 0) return "active";
  return "idle";
}

function stateClass(state) {
  if (state === "done") return "pill done";
  if (state === "active") return "pill active";
  return "pill gray";
}

function nextPendingStage(stages) {
  return stages.find((stage) => stageCompletion(stage) < 100) || stages[stages.length - 1];
}

function Section({ title, items, tone = "" }) {
  return (
    <div className="section-block">
      <h3>{title}</h3>
      <div className="section-list">
        {items.map((item) => (
          <div className={`list-card ${tone}`} key={item}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [project, setProject] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [stages, setStages] = useState([]);
  const [activeStageId, setActiveStageId] = useState(null);
  const [tab, setTab] = useState("home");
  const [decisions, setDecisions] = useState({
    bedPosition: false,
    windowSpec: false,
    drainTestPlan: false,
    applianceSizes: false,
  });

  const activeStage = useMemo(
    () => stages.find((stage) => stage.id === activeStageId) || stages[0],
    [stages, activeStageId]
  );

  const alerts = useMemo(() => {
    const out = [];
    if (!activeStage || !project) return out;

    if (activeStage.id === "electrical" && !decisions.bedPosition) {
      out.push("침대 위치 미확정 상태에서 전기 진행 시 콘센트 위치 오류 위험이 큽니다.");
    }
    if (project.hasExtension && activeStage.id === "extension" && !decisions.windowSpec) {
      out.push("확장공사 중 창호 사양 미확정 상태는 결로와 단열 하자 위험을 높입니다.");
    }
    if (activeStage.id === "tile" && !decisions.drainTestPlan) {
      out.push("타일 단계 전 배수 테스트 계획이 없으면 물 고임 하자 확인이 늦어질 수 있습니다.");
    }
    if (project.hasKitchenChange && activeStage.id === "furniture" && !decisions.applianceSizes) {
      out.push("주방 가전 치수 미확정 상태에서는 가구 제작 오차와 문 간섭 위험이 커집니다.");
    }
    if (stageCompletion(activeStage) < 50) {
      out.push("현재 단계 핵심 체크 완료율이 낮습니다. 다음 공정으로 넘어가기 전에 선결정 항목을 먼저 정리하세요.");
    }
    return out;
  }, [activeStage, decisions, project]);

  const createProject = () => {
    const newProject = {
      ...form,
      area: Number(form.area),
      bathroomCount: Number(form.bathroomCount),
      budget: Number(form.budget),
    };
    const newStages = generateStages(newProject);
    setProject(newProject);
    setStages(newStages);
    setActiveStageId(newStages[0]?.id || null);
    setTab("home");
  };

  const resetProject = () => {
    setProject(null);
    setStages([]);
    setActiveStageId(null);
    setTab("home");
    setDecisions({
      bedPosition: false,
      windowSpec: false,
      drainTestPlan: false,
      applianceSizes: false,
    });
  };

  const updateChecklist = (stageId, index, checked) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              completedChecklist: {
                ...stage.completedChecklist,
                [index]: checked,
              },
            }
          : stage
      )
    );

    if (stageId === "electrical" && index === 0) setDecisions((d) => ({ ...d, bedPosition: checked }));
    if (stageId === "extension" && index === 2) setDecisions((d) => ({ ...d, windowSpec: checked }));
    if (stageId === "tile" && index === 1) setDecisions((d) => ({ ...d, drainTestPlan: checked }));
    if (stageId === "furniture" && index === 2) setDecisions((d) => ({ ...d, applianceSizes: checked }));
  };

  const updateNote = (stageId, value) => {
    setStages((prev) =>
      prev.map((stage) => (stage.id === stageId ? { ...stage, notes: value } : stage))
    );
  };

  if (!project) {
    return (
      <div className="app-shell">
        <header className="hero">
          <div>
            <h1>Reve Plate</h1>
            <p>정식 배포용 React 버전입니다. GitHub와 Netlify에 연결해 운영용으로 올릴 수 있습니다.</p>
          </div>
        </header>

        <div className="setup-grid">
          <div className="card">
            <div className="card-title">프로젝트 만들기</div>

            <div className="form-grid">
              <div className="field">
                <label>프로젝트 이름</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div className="field">
                <label>집 유형</label>
                <select value={form.houseType} onChange={(e) => setForm({ ...form, houseType: e.target.value })}>
                  <option>아파트</option>
                  <option>빌라</option>
                  <option>오피스텔</option>
                  <option>단독주택</option>
                  <option>상가</option>
                </select>
              </div>

              <div className="field">
                <label>평형</label>
                <input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
              </div>

              <div className="field">
                <label>공사 범위</label>
                <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}>
                  <option value="full">전체 리모델링</option>
                  <option value="partial">부분 리모델링</option>
                  <option value="surface">도배/바닥 중심</option>
                </select>
              </div>

              <div className="field">
                <label>욕실 개수</label>
                <input
                  type="number"
                  value={form.bathroomCount}
                  onChange={(e) => setForm({ ...form, bathroomCount: e.target.value })}
                />
              </div>

              <div className="field">
                <label>예산 (만원)</label>
                <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
              </div>

              <div className="field wide">
                <label>입주 예정일</label>
                <input type="date" value={form.moveInDate} onChange={(e) => setForm({ ...form, moveInDate: e.target.value })} />
              </div>
            </div>

            <div className="sub-panel">
              <div className="sub-title">조건 선택</div>
              <div className="option-grid">
                {[
                  ["hasExtension", "확장공사 있음"],
                  ["hasKitchenChange", "주방 변경 있음"],
                  ["hasWindowChange", "창호 교체 있음"],
                  ["hasCustomFurniture", "제작가구 있음"],
                  ["hasHvacChange", "냉난방 변경 있음"],
                ].map(([key, label]) => (
                  <label className="option-chip" key={key}>
                    <input
                      type="checkbox"
                      checked={!!form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="btn btn-black wide-btn" onClick={createProject}>
              공정표 자동 생성하기
            </button>
          </div>

          <div className="side-column">
            <div className="card info-card">
              <div className="small-title">이 버전의 의미</div>
              <div className="muted-box">
                미리보기 파일이 아니라 React 프로젝트 전체입니다. GitHub에 폴더째 올리고 Netlify에 연결해서 정식 운영용으로 쓰는 버전입니다.
              </div>
            </div>

            <div className="card info-card">
              <div className="small-title">배포 후 장점</div>
              <div className="muted-box">
                수정할 때마다 GitHub에만 올리면 Netlify가 자동으로 다시 배포합니다. 주소는 그대로 유지됩니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const current = activeStage;
  const overall = overallCompletion(stages);
  const currentPercent = stageCompletion(current);
  const nextStage = nextPendingStage(stages);
  const totalDays = stages.reduce((sum, stage) => sum + stage.durationDays, 0);

  return (
    <div className="app-shell main-mode">
      <div className="topbar">
        <div className="top-brand">
          <div>
            <div className="brand-title">Reve Plate</div>
            <div className="brand-sub">반셀프 인테리어 공정 운영 앱</div>
          </div>
        </div>
        <button className="btn btn-outline" onClick={resetProject}>
          다시 만들기
        </button>
      </div>

      {tab === "home" && (
        <div className="page-grid">
          <div className="card">
            <div className="head-row">
              <div>
                <div className="badge-row">
                  <span className="pill black">{project.houseType}</span>
                  <span className="pill gray">{project.area}평</span>
                </div>
                <div className="card-title main-title">{project.name}</div>
                <div className="muted-text">지금 해야 할 일부터 다음 단계까지 한 화면에서 확인합니다.</div>
              </div>
              <span className={stateClass(stageState(current))}>현재 단계 · {current.short}</span>
            </div>

            <div className="metric-grid">
              <div className="metric active">
                <div className="metric-label">전체 진행률</div>
                <div className="metric-value">{overall}%</div>
              </div>
              <div className={`metric ${stageState(current) === "done" ? "done" : "active"}`}>
                <div className="metric-label">현재 단계 완료율</div>
                <div className="metric-value">{currentPercent}%</div>
              </div>
              <div className="metric neutral">
                <div className="metric-label">예상 총 기간</div>
                <div className="metric-value">{totalDays}일</div>
              </div>
            </div>

            <div className="progress-head">
              <span>전체 진행 상태</span>
              <span>{overall}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${overall}%` }} />
            </div>
          </div>

          <div className="card">
            <div className="card-title">다음 단계 예고</div>
            <div className="muted-box">
              <strong>{nextStage.short}</strong>
              <br />
              현재 단계 정리가 끝나면 다음 공정으로 자연스럽게 이어집니다.
            </div>
            <div className="stack-buttons">
              <button className="btn btn-black" onClick={() => setTab("stages")}>
                공정표 보기
              </button>
              <button className="btn btn-outline" onClick={() => setTab("questions")}>
                질문 카드 보기
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-title">오늘 해야 할 체크</div>
            <div className="list-stack">
              {current.checklist.slice(0, 5).map((item, idx) => {
                const checked = !!current.completedChecklist?.[idx];
                return (
                  <div className={`check-item ${checked ? "done" : ""}`} key={item}>
                    <span className="check-mark">{checked ? "✅" : "⬜"}</span>
                    <span className="check-text">{item}</span>
                  </div>
                );
              })}
            </div>
            <button className="btn btn-outline top-gap" onClick={() => setTab("check")}>
              체크리스트 전체 보기
            </button>
          </div>

          <div className="card">
            <div className="card-title">위험 경고</div>
            <div className="list-stack">
              {alerts.length ? (
                alerts.map((item) => (
                  <div className="alert-item" key={item}>
                    ⚠ {item}
                  </div>
                ))
              ) : (
                <div className="muted-box">현재 기준으로 큰 경고는 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "stages" && (
        <div className="split-grid">
          <div className="card">
            <div className="card-title">공정표</div>
            <div className="list-stack">
              {stages.map((stage) => {
                const percent = stageCompletion(stage);
                return (
                  <button
                    key={stage.id}
                    className={`stage-button ${activeStageId === stage.id ? "active" : ""}`}
                    onClick={() => setActiveStageId(stage.id)}
                  >
                    <div className="stage-row">
                      <div>
                        <div className="stage-name">{stage.name}</div>
                        <div className="stage-meta">
                          Day {stage.startDay} ~ {stage.endDay} · {stage.durationDays}일
                        </div>
                      </div>
                      <span className={stateClass(stageState(stage))}>{percent}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-title">{current.name}</div>
            <div className="detail-stack">
              <Section title="단계 개요" items={[current.overview]} />
              <Section title="이 단계에서 결정해야 할 것" items={current.decisions} />
              <Section title="기준값 / 판단 기준" items={current.standards} tone="soft" />
              <Section title="업체 질문 카드" items={current.questions} tone="soft" />
              <Section title="좋은 시공 기준" items={current.good} tone="good" />
              <Section title="나쁜 시공 징후" items={current.bad} tone="bad" />
              <Section title="대표 리스크" items={current.risks} tone="warn" />
            </div>
          </div>
        </div>
      )}

      {tab === "check" && (
        <div className="split-grid">
          <div className="card">
            <div className="head-row">
              <div className="card-title no-gap">{current.short} 체크리스트</div>
              <span className={stateClass(stageState(current))}>{currentPercent}% 완료</span>
            </div>
            <div className="list-stack">
              {current.checklist.map((item, idx) => (
                <label className={`check-item block ${current.completedChecklist?.[idx] ? "done" : ""}`} key={item}>
                  <input
                    type="checkbox"
                    checked={!!current.completedChecklist?.[idx]}
                    onChange={(e) => updateChecklist(current.id, idx, e.target.checked)}
                  />
                  <span className="check-text">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">현장 메모</div>
            <textarea
              value={current.notes || ""}
              onChange={(e) => updateNote(current.id, e.target.value)}
              placeholder="현장 확인 사항, 업체 답변, 치수 메모 등을 적어두세요."
            />
            <div className={`note-box top-gap ${stageState(current) === "done" ? "done" : "active"}`}>
              현재 단계 완료율은 {currentPercent}%입니다. 핵심 항목을 다 채우면 다음 단계 판단이 훨씬 쉬워집니다.
            </div>
          </div>
        </div>
      )}

      {tab === "questions" && (
        <div className="split-grid">
          <div className="card">
            <div className="card-title">{current.short} 질문 카드</div>
            <div className="detail-stack">
              {current.questions.map((q) => (
                <div className="list-card" key={q}>
                  {q}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title">추천 사용 방법</div>
            <div className="detail-stack">
              <div className="muted-box">현장 미팅 전 질문 3개만 먼저 고르세요.</div>
              <div className="muted-box">업체 답변을 들은 뒤 메모 탭에 바로 기록하세요.</div>
              <div className="muted-box">답변이 모호하면 기준값 탭과 비교해서 다시 확인하세요.</div>
            </div>
          </div>
        </div>
      )}

      {tab === "risks" && (
        <div className="split-grid">
          <div className="card">
            <div className="card-title">현재 위험 경고</div>
            <div className="detail-stack">
              {alerts.length ? (
                alerts.map((a) => (
                  <div className="alert-item" key={a}>
                    ⚠ {a}
                  </div>
                ))
              ) : (
                <div className="muted-box">현재 큰 경고는 없습니다.</div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-title">{current.short} 대표 리스크</div>
            <div className="detail-stack">
              {current.risks.map((risk) => (
                <div className="list-card soft" key={risk}>
                  {risk}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        {[
          ["home", "홈"],
          ["stages", "공정표"],
          ["check", "체크"],
          ["questions", "질문"],
          ["risks", "더보기"],
        ].map(([key, label]) => (
          <button key={key} className={`nav-btn ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
