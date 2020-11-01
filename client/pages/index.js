const LandingPage = ({ user }) => {
  return user ? <h1>You are logged</h1> : <h1>You are not loggged</h1>
}

LandingPage.getInitialProps = async (context, axios, user) => {
  return {}
}

export default LandingPage
