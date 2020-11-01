import axios from "axios"

export const axiosBuilder = ({ req }) => {
  const isServer = !!req
    ? {
        url: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        headers: req.headers
      }
    : { url: "/", headers: "" }

  // REQUEST
  return axios.create({ baseURL: isServer.url, headers: isServer.headers })
}
