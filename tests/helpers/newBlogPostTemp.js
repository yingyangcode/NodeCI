// Temporary file to create a new blog post
// for puppeteer to evaluate our fetch request
// we must return a function which performs the fetch when its executed
() => {
  return fetch('/api/blogs', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({title: 'My Title', content: 'My Content'})
  });
}
// api request to get blogs
() => {
  return fetch('/api/blogs', {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
