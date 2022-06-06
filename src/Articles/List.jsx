import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { articlesAtom } from "../_state";
import { useUserActions } from '_actions';

export { List };

function List({ match }) {
  const { path } = match;
  const role = JSON.parse(localStorage.getItem('user')).role;
  const articles = useRecoilValue(articlesAtom);
  const userActions = useUserActions();

  useEffect(() => {
    userActions.getAllArticles();

    return userActions.resetArticles;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Articles</h1>
      <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Article</Link>
      <table className="table table-striped">
        <thead>
        <tr className="text-white">
          <th style={{ width: '30%' }}>Title</th>
          <th style={{ width: '30%' }}>Autor</th>
          <th style={{ width: '30%' }}>Tags</th>
          <th style={{ width: '10%' }}></th>
        </tr>
        </thead>
        <tbody>
        {articles?.map(article =>
          <>
            <tr className="text-white" key={article.knowledgebasearticleid}>
              <td>{article.title}</td>
              <td>{article.author.username}</td>
              <td>{article.tags.forEach((x) => `${x.name} `)}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Link to={{
                  pathname: `${path}/${article.knowledgeBaseArticleId}`,
                  state: {
                    title: article.title,
                    description: article.author.username,
                    date: article.content,
                  },
                }} className="btn btn-sm btn-primary mr-1 bg-green-400 text-black border-none hover:bg-green-500">View</Link>
                <Link to={`${path}/edit/${article.knowledgeBaseArticleId}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                <button onClick={() => userActions.deleteArticle(article.knowledgeBaseArticleId)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={article.isDeleting}>
                  {article.isDeleting
                    ? <span className="spinner-border spinner-border-sm"></span>
                    : <span>Delete</span>
                  }
                </button>
              </td>
            </tr>
          </>
        )}
        {!articles &&
          <tr>
            <td colSpan="4" className="text-center">
              <span className="spinner-border spinner-border-lg align-center"></span>
            </td>
          </tr>
        }
        </tbody>
      </table>
    </div>
  );
}