// 오류 응답에서 사용자에게 보여줄 메시지를 꺼낸다.
// 백엔드가 꺼져 있으면(502) 본문이 비어 있어 JSON으로 읽을 수 없으므로 상태 코드로 안내한다.
export async function readErrorMessage(res: Response): Promise<string> {
    try {
        const body = await res.json()
        if (body.errors) {
            return Object.values(body.errors).join('\n')
        }
        return body.message ?? `요청에 실패했습니다. (${res.status})`
    } catch {
        if (res.status === 502 || res.status === 504) {
            return '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.'
        }
        return `요청에 실패했습니다. (${res.status})`
    }
}