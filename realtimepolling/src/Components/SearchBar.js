import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './Styles/Createpoll.css'

function SearchBar() {
  return (
    <div className="container mt-4">
      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search..."
          className="mr-2 search-input"
          aria-label="Search"
        />
        <Button  type="submit" className='search-button'>
          Search
        </Button>
      </Form>
    </div>
  );
}

export default SearchBar;
