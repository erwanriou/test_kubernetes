import "bootstrap/dist/css/bootstrap.css"
import { isServerHelper } from "../api/isServerHelper"

// IMPORT COMPONENT
import Header from "../components/Header"

const AppComponent = ({ Component, pageProps, user }) => {
  return (
    <>
      <Header user={user} />
      <Component {...pageProps} />
    </>
  )
}

AppComponent.getInitialProps = async appContext => {
  const axios = isServerHelper(appContext.ctx)
  const { data } = await axios.get("/api/users/user")

  // ENABLE PAGE GETINITIALPROPS
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }

  return { pageProps, ...data }
}

export default AppComponent
