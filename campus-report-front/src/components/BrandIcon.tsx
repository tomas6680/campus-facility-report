// 서비스 로고 아이콘 (경광등 모양)
// 로그인 카드와 상단 헤더에서 같이 쓰고, 색·크기는 감싸는 배지의 CSS가 정함
function BrandIcon() {
    return (
        <svg className="brand-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 18v-6a5 5 0 0 1 10 0v6" />
            <rect x="5" y="18" width="14" height="3.5" rx="1.2" />
            <path d="M9.6 12a2.4 2.4 0 0 1 2.4-2.4" />
            <path d="M12 2.5v1.8M4.6 5.6l1.3 1.3M19.4 5.6l-1.3 1.3M2.5 12.5h1.8M19.7 12.5h1.8" />
        </svg>
    )
}

export default BrandIcon
