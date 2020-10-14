import { isServerHelper } from "../api/isServerHelper"

const LandingPage = ({ user }) => {
  return user ? <h1>You are logged</h1> : <h1>You are not loggged</h1>
}

LandingPage.getInitialProps = async context => {
  const axios = isServerHelper(context)
  // REQUEST
  const { data } = await axios.get("/api/users/user")
  return data
}

export default LandingPage
