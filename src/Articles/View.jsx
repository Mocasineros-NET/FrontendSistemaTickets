import React from 'react';
import { useEffect } from "react";
import {useRecoilValue} from "recoil";
import { useUserActions} from "../_actions";

import { articleAtom } from "../_state";

function View({ match }) {
  const { id } = match.params;
  const userActions = useUserActions();
  const article = useRecoilValue(articleAtom);

  useEffect(() => {
    userActions.getArticleById(id).then(() => userActions.resetArticle);
  }, []);

  const loading = !article;
  return (
    <>
      <h1>Articles</h1>
      {!loading &&
        <>
          <p>{article.title}</p>
          <p>{article.author.username}</p>
          <p>{article.content}</p>
        </>
      }
      {loading &&
        <div className="text-center p-3">
          <span className="spinner-border spinner-border-lg align-center"></span>
        </div>
      }
    </>
  );
}

export { View };