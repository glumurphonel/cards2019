import React, { Component } from 'react'
import history from '../history'

// UI-Components
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'

class Header extends Component {

  render() {
    return (
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container>
          <Navbar.Brand href='/'>Flashcards</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto'>
              {
                this.props.account.accountRegistered
                ?
                  <Nav.Link href='/submit' onSelect={e => {e.preventDefault();history.push('/submit')}}>
                    Submit Flashcard
                  </Nav.Link>
                : <Nav.Link onClick={e => this.props.registerAccount(e)}>
                    Register account
                  </Nav.Link>
              }
              <NavDropdown title="Flashcards" id="basic-nav-dropdown">
                <NavDropdown.Item href="/">Audited Flashcards</NavDropdown.Item>
                <NavDropdown.Item href="/notaudited">Not Audited Flashcards</NavDropdown.Item>
                <NavDropdown.Item href="/favorites">My Favorite Flashcards</NavDropdown.Item>
                <NavDropdown.Item href="/submitted">My Submitted Flashcards</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Navbar.Text>
                {this.props.account.address} ({this.props.account.accountRegistered ? 'registered' : 'not registered'})
              </Navbar.Text>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}

export default Header
