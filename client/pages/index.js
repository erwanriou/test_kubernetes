import { isServerHelper } from "../api/isServerHelper"

const LandingPage = ({ user }) => {
  console.log(user)
  return <h1>LANDING PAGE</h1>
}

LandingPage.getInitialProps = async context => {
  const axios = isServerHelper(context)
  // REQUEST
  const { data } = await axios.get("/api/users/user")
  return data
}

export default LandingPage
