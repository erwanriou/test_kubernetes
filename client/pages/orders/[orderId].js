import { useState, useEffect } from "react"
import Router from "next/router"
import { useRequest } from "../../hooks/useRequest"
import StripeCheckout from "react-stripe-checkout"

const OrderShow = ({ user, order }) => {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [order])

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSucces: payment => Router.push("/orders")
  })

  return (
    <div>
      <h1>{order.title}</h1>
      {timeLeft > 0 ? (
        <p>{timeLeft} sdes before order expire.</p>
      ) : (
        <p>Order expired.</p>
      )}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51HiP0OFAFLwb53y3uBiFQZ0LZvvomSzJdKZx7juhG0vy0JNAeldkp7c1ehwtBVLp3ZkYPKyY1ss363kpPvNhtXXK007XkvhDM2"
        amount={order._ticket.price * 100}
        email={user.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, axios) => {
  const { orderId } = context.query
  const { data } = await axios.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
