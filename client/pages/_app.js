import "bootstrap/dist/css/bootstrap.css"
import { axiosBuilder } from "../api/axiosBuilder"

// IMPORT COMPONENT
import Header from "../components/Header"

const AppComponent = ({ Component, pageProps, user }) => {
  return (
    <>
      <Header user={user} />
      <div className="container">
        <Component {...pageProps} user={user} />
      </div>
    </>
  )
}

AppComponent.getInitialProps = async appContext => {
  const axios = axiosBuilder(appContext.ctx)
  const { data } = await axios.get("/api/users/user")

  // ENABLE PAGE GETINITIALPROPS
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      axios,
      data.user
    )
  }

  return { pageProps, ...data }
}

export default AppComponent
