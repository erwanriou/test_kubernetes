// REQUIRES FONCTION
const requires = (path, array, extention) =>
  array.map(item => ({
    path: require(`../routes/${path}/${item}`),
    url:
      extention !== undefined
        ? `/${path}/${extention}/${item}`
        : `/${path}/${item}`
  }))

let routes = ["login", "logout", "register", "user"]
routes = requires("api", routes, "users")

module.exports = routes = [...routes]
