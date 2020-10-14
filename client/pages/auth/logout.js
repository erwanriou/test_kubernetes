import { useEffect } from "react"
import router from "next/router"
import { useRequest } from "../../hooks/useRequest"

const Logout = () => {
  const { doRequest, errors } = useRequest({
    url: "/api/users/logout",
    method: "post",
    body: {},
    onSucces: () => router.push("/")
  })

  useEffect(() => {
    doRequest()
  }, [])
  return <div>You are signing out...</div>
}

export default Logout
