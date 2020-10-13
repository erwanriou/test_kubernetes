import axios from "axios"
import { useState } from "react"

export const useRequest = ({ url, method, body, onSucces }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async router => {
    try {
      setErrors(null)
      const res = await axios[method](url, body)
      if (onSucces) {
        onSucces(res.data)
      }
      return res.data
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Opps...</h4>
          <ul className="my-0">
            {err.response.data.errors.map(e => (
              <li key={e.message}>{e.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors }
}
