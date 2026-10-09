import { useState } from 'react'

function App() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId, password }),
    })

    if (!res.ok) {
      const err = await res.json()
      alert(err.message)
      return
    }

    const data = await res.json()
    localStorage.setItem('token', data.token)
    console.log('로그인 성공', data)
  }

  return (
      <div>
        <h1>로그인</h1>
        <input
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
        />
        <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
      </div>
  )
}

export default App