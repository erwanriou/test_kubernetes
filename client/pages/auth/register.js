import { useState } from "react"
import axios from "axios"

const Register = () => {
  // HOOKS
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState([])

  //SUBMIT
  const handleSubmit = async e => {
    e.preventDefault()
    const data = { email, password }
    try {
      const res = await axios.post("/api/users/register", data)
      console.log(res.data)
    } catch (err) {
      setErrors(err.response.data.errors)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
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
      {errors.map(err => err.message)}
      <button className="btn btn-primary" type="submit">
        Register
      </button>
    </form>
  )
}

export default Register
