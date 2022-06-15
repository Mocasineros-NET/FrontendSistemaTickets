import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { articlesAtom } from "../_state";
import { useUserActions } from '../_actions';

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
      <h1 className="text-4xl font-bold mb-3">📄Articles</h1>
      {role !== 2 && <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Article</Link>}
      <table className="table table-zebra w-full">
        <thead>
        <tr>
          <th style={{ width: '30%' }}>Title</th>
          <th style={{ width: '30%' }}>Author</th>
          <th style={{ width: '30%' }}>Tags</th>
          <th style={{width: '10%'}}/>
        </tr>
        </thead>
        <tbody>
        {articles?.map(article =>
          <tr key={article.knowledgeBaseArticleId}>
            <td>{article.title}</td>
            <td>{article.author.username}</td>
            <td>{article.tags.map((tag) => tag.name)}</td>
            <td style={{ whiteSpace: 'nowrap' }}>
              <Link to={{pathname: `${path}/${article.knowledgeBaseArticleId}`}} className="btn btn-sm btn-primary mr-1 border-none">View</Link>
              {role !== 2 && <Link to={`${path}/edit/${article.knowledgeBaseArticleId}`} className="btn btn-sm btn-primary mr-1">Edit</Link>}
              {role !== 2 && <button onClick={() => userActions.deleteArticle(article.knowledgeBaseArticleId)} className="btn btn-sm bg-red-500" style={{ width: '60px' }} disabled={article.isDeleting}>
                {article.isDeleting
                  ? <span className="spinner-border spinner-border-sm"/>
                  : <span>Delete</span>
                }
              </button>}
            </td>
          </tr>
        )}
        {!articles &&
          <tr>
            <td colSpan="4" className="text-center">
              <span className="spinner-border spinner-border-lg align-center"/>
            </td>
          </tr>
        }
        </tbody>
      </table>
    </div>
  );
}
