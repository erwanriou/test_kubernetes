// REQUIRES FONCTION
const requires = (path, array, extention) =>
  array.map(item => ({
    path: require(`../routes/${path}/${item}`),
    url: `/${path}/${item}`
  }))

let routes = ["tickets"]
routes = requires("api", routes)

module.exports = routes = [...routes]
