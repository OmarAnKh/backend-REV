import { useState } from 'react'
const NavBar = () => {
    const [city, setCity] = useState("")
    const [weather, setWeather] = useState({})
    const handleClick = (e) => {
        e.preventDefault()
        fetch("/weather?address=" + city).then((res) => {
            res.json().then((data) => {
                setWeather(data)
            })
        }).catch((error) => {
            console.log(error)
        })
    };
    return (<>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    Navbar
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Link
                            </a>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Dropdown
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Action
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Another action
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Something else here
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link disabled"
                                href="#"
                                tabIndex={-1}
                                aria-disabled="true"
                            >
                                Disabled
                            </a>
                        </li>
                    </ul>
                    <form className="d-flex" action='' >
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            onChange={(e) => {
                                setCity(e.target.value)
                            }}
                        />
                        <button className="btn btn-outline-success" onClick={handleClick}>
                            Search
                        </button>
                    </form>

                </div>
            </div>
        </nav>

    </>)
}

export default NavBar
