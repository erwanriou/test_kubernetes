import { useState } from "react"
import { useRequest } from "../../hooks/useRequest"
import Router from "next/router"

const NewTicket = () => {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSucces: () => Router.push("/")
  })

  const handleOnBlur = () => {
    const value = parseFloat(price)
    if (isNaN(value)) {
      return
    }
    setPrice(value.toFixed(2))
  }

  const handleSubmit = e => {
    e.preventDefault()

    doRequest()
  }

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="form-control"
          />
          <label>Price</label>
          <input
            value={price}
            onBlur={handleOnBlur}
            onChange={e => setPrice(e.target.value)}
            className="form-control"
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewTicket
