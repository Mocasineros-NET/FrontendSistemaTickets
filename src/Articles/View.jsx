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
    <div className="card w-[100%] bg-base-100 shadow-xl">
      <div className="card-body">
        {!loading &&
        <>
          <h1 className="font-black text-2xl mb-3 justify-self-start">📄{article.title}</h1>
          <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
            <span className="text-slate-500">Author</span>
            <p className="font-bold">{article.author.firstName} {article.author.lastName}</p>
          </div>
          <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
            <span className="text-slate-500">Tags</span>
            <p className="font-bold">{!article.tags && "None"}{article.tags && article.tags.map((t) => t.name)}</p>
          </div>
          <hr className="my-3 border-black"/>
          <p>{article.content}</p>
          <hr className="my-3 border-black"/>
        </>
        }
      </div>
    </div>
  );
}

export { View };