// REQUIRES FONCTION
const requires = (path, array) =>
  array.map(item => ({
    url: `/${path}/${item}`,
    path: require(`../routes/${path}/${item}`)
  }))

let auth = ["users"]
    auth = requires("api", auth)


module.exports = routes = [ ...auth ]
