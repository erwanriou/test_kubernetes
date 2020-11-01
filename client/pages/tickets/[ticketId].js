import { useRequest } from "../../hooks/useRequest"
import Router from "next/router"

const TicketShow = ({ user, ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSucces: order => Router.push("/orders/[orderId]", `/orders/${order.id}`)
  })

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  )
}

TicketShow.getInitialProps = async (context, axios) => {
  const { ticketId } = context.query
  const { data } = await axios.get(`/api/tickets/${ticketId}`)

  return { ticket: data }
}

export default TicketShow
