import Link from "next/link"

const LandingPage = ({ user, tickets }) => {
  const renderTicket = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a className="nav-link">View</a>
        </Link>
      </td>
    </tr>
  ))

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{renderTicket}</tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context, axios, user) => {
  const { data } = await axios.get("/api/tickets")
  return { tickets: data }
}

export default LandingPage
