/* load news category name */
loadCategoryName = async () => {
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/news/categories`);
    const data = await res.json();
    displayNewsCategoryName(data.data.news_category);
  } 
  catch (error) {
    console.log(error);
  }
}

displayNewsCategoryName = (allNewsHeadLine) => {
  const newsCategoryContainer = document.getElementById('news-category-container');
  allNewsHeadLine.forEach(news => {
    const div = document.createElement('div');
    div.classList.add('me-3');
    div.innerHTML = `
      <a onclick="loadDetails('${news.category_id}')" class="category-name d-block text-white nav-link" href="#">${news.category_name}</a>
    `;
    newsCategoryContainer.appendChild(div);
  });

  const categoryName = document.getElementsByClassName('category-name');
  for (const name of categoryName) {
    name.addEventListener('click', () => {
      document.getElementById('categoryName').innerText = name.innerText;
    });
  }
}

/* load news Details news */
loadDetails = (id) => {
  spinner(true);
  const url = `https://openapi.programming-hero.com/api/news/category/${id}`
  fetch(url)
    .then(res => res.json())
    .then(data => displayNewsDetails(data.data))
    .catch(error => console.log(error))
}

displayNewsDetails = (allNewsCategory) => {
  const newsDetailsContainer = document.getElementById('news-details');
  newsDetailsContainer.innerText = '';

  // no news found : 404 error show
  const foundNews = document.getElementById('no-found-news');
  if (allNewsCategory.length === 0) {
    foundNews.classList.remove('d-none');
    spinner(false)
  }
  else {
    foundNews.classList.add('d-none');
  }

  const newsFound = document.getElementById('total-news');
  newsFound.innerText = `
    ${allNewsCategory.length ? allNewsCategory.length : "0"} items found
  `;

  allNewsCategory.sort((a, b) => b.total_view - a.total_view);

  allNewsCategory.forEach(news => {
    const details = ((news.details).slice(0, 200));

    const div = document.createElement('div');
    div.classList.add('card');
    div.classList.add('mb-4');
    div.innerHTML = `
    <div class="row">
      <div class="col-md-4"> <img src="${news.image_url}" class="img-fluid rounded-start h-100" alt="img-here"> </div>
      
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${news.title}</h5>
          <p class="card-text text-sort">${details + '...'}</p>
          <div class="row">
            <div class="col-6 col-md-6 col-lg-4">
              <div class="d-flex">
                <div class="w-25"> <img class="img-fluid rounded-circle" src="${news.author.img}" alt=""> </div>
                <div class="ms-3">
                  <p class="m-0">${news.author.name ? news.author.name : "Name not found"}</p>
                  <p class="m-0">${news.author.published_date}</p>
                </div>
              </div>
            </div>
            <div class="col">
              <div>
                <i class="fa-regular fa-eye"></i>
                <b>${news.total_view ? news.total_view : "not found"} M</b>
              </div>
            </div>
            <div id="staticBackdrop" class="col">
              <div> 
                <button onclick="showNewsDetails('${news._id}')" href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#showModal"><i class="fa-solid fa-angles-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    newsDetailsContainer.appendChild(div);
    spinner(false);
  });
}

// modal
showNewsDetails = (id) => {
  fetch(`https://openapi.programming-hero.com/api/news/${id}`)
    .then(res => res.json())
    .then(data => displayDetails(data.data[0]))
    .catch(error => console.log(error))
}

displayDetails = (news) => {
  document.getElementById('staticBackdropLabel').innerText = news.title;
  const newsDetailsContainer = document.getElementById('newsDetails')
  newsDetailsContainer.innerHTML = `
  <img class="img-fluid"  src="${news.image_url}" />
  <h6 class="mt-3">Author Name: ${news.author.name}</h6>
  <p class="mt-3">Publish Data: ${news.author.published_date}</p>
  <p class="mt-3">Total view: ${news.total_view}M</p>
  <p class="mt-3">${news.details}</p>
  `;
}

// spinner
spinner = (isLoading) => {
  const spinner = document.getElementById('spinner');
  if (isLoading === true) {
    spinner.classList.remove('d-none');
  }
  else {
    spinner.classList.add('d-none');
  }
}

loadDetails("01")
loadCategoryName();