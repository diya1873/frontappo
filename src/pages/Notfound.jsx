import React from 'react'
import './NotFound.css';
export default function Notfound() {
  return (
    <div>
    <div class="container">
    <div class="gif">
      <img src="https://ultimateblocks.com/wp-content/uploads/2021/01/giphy.gif" alt="gif_ing" />
    </div>
    <div class="content">
      <h1 class="main-heading">This page is gone. 😏</h1>
      <p>
        ...maybe the page you're looking for is not found or never existed.
      </p>
      <a href="/" target="blank">
        <button>Back to home 😏 <i class="far fa-hand-point-right"></i></button>
      </a>
    </div>
  </div>
    </div>
  )
}
