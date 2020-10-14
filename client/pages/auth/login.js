import { useState } from "react"
import router from "next/router"
// FETCH HOOKS
import { useRequest } from "../../hooks/useRequest"

const Login = () => {
  // HOOKS
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { doRequest, errors } = useRequest({
    url: "/api/users/login",
    method: "post",
    body: { email, password },
    onSucces: () => router.push("/")
  })

  //SUBMIT
  const handleSubmit = async e => {
    e.preventDefault()
    await doRequest()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <div className="form-group">
        <label>Email Adress</label>
        <input
          className="form-control"
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className="btn btn-primary" type="submit">
        Login
      </button>
    </form>
  )
}

export default Login
