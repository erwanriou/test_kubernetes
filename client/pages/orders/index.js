const Orders = ({ orders }) => {
  return (
    <div>
      <h1>My orders</h1>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            {order._ticket.title} / {order.status}
          </li>
        ))}
      </ul>
    </div>
  )
}

Orders.getInitialProps = async (context, axios) => {
  const { data } = await axios.get("/api/orders")

  return { orders: data }
}

export default Orders
