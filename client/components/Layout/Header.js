import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import Link from "next/link";

const Header = () => {
  return (
    <Navbar expand='lg' className='mb-4 navbar-dark bg-primary'>
      <Container>
        <Link href='/'>
          <a className='navbar-brand'>KickStarter</a>
        </Link>

        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Link href='/'>
              <a className='nav-link'>Campaigns</a>
            </Link>
            <Link href='/campaigns/new'>
              <a className='nav-link'>Create</a>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
