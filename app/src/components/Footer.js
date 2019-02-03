import React, { Component } from 'react'
import { Container } from 'react-bootstrap'

class Footer extends Component {
  render() {
    return (
      <footer className='bg-dark'>
        <Container>
          <section className='copyright text-center'>Copyright (c) 2018-present</section>
        </Container>
      </footer>
    )
  }
}

export default Footer
