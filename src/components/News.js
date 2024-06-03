import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  const updateNews = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=6625f53440954f829077c2fb3cef2a20&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - TheNewsRoom`;
    updateNews();
    // eslint-disable-next-line
  }, []);

  const handlePreviousClick = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=6625f53440954f829077c2fb3cef2a20&page=${
      page - 1
    }&pageSize=${props.pageSize}`;
    setLoading(true);

    let data = await fetch(url);
    let parsedData = await data.json();
    setPage(page - 1);
    setArticles(parsedData.articles);
    setLoading(false);
  };

  const handleNextClick = async () => {
    if (page + 1 <= Math.ceil(totalResults / props.pageSize)) {
      let url = `https://newsapi.org/v2/top-headlines?country=${
        props.country
      }&category=${
        props.category
      }&apiKey=6625f53440954f829077c2fb3cef2a20&page=${page + 1}&pageSize=${
        props.pageSize
      }`;
      setLoading(true);
      let data = await fetch(url);
      let parsedData = await data.json();
      setPage(page + 1);
      setArticles(parsedData.articles);
      setLoading(false);
    }
  };

  return (
    <div className="container my-3">
      <h1 className="text-center" style={{ marginTop: "90px" }}>
        Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <div className="row">
        {!loading &&
          articles &&
          articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={
                    element.description ? element.description.slice(0, 88) : ""
                  }
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                ></NewsItem>
              </div>
            );
          })}
      </div>
      <div className="container d-flex justify-content-between">
        <button
          disabled={page <= 1}
          type="button"
          className="btn btn-dark"
          onClick={handlePreviousClick}
        >
          &larr; Previous
        </button>
        <button
          disabled={page + 1 > Math.ceil(totalResults / props.pageSize)}
          type="button"
          className="btn btn-dark"
          onClick={handleNextClick}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 10,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
