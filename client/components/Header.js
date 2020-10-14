import Link from "next/link"

const Header = ({ user }) => {
  const links = [
    { isLogged: user, label: "logout", href: "/auth/logout" },
    { isLogged: !user, label: "login", href: "/auth/login" },
    { isLogged: !user, label: "register", href: "/auth/register" }
  ]
    .filter(({ isLogged }) => isLogged)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    ))

  return (
    <header className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="nav-link">Ticketing App</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav g-flex align-items-center">{links}</ul>
      </div>
    </header>
  )
}

export default Header
