// REQUIRES FONCTION
const requires = (path, array, extention) =>
  array.map(item => ({
    path: require(`../routes/${path}/${item}`),
    url:
      extention !== undefined
        ? `/${path}/${extention}/${item}`
        : `/${path}/${item}`
  }))

let routes = ["orders"]
routes = requires("api", routes)

module.exports = routes = [...routes]
