import React from 'react';
import { useEffect, useState } from "react";
import {useRecoilValue} from "recoil";

import { articleAtom } from "../_state";
import { useUserActions} from "../_actions";
import { Link, useLocation } from "react-router-dom";

function View({ history, match }) {
  const { knowledgeBaseArticleId } = match.params;
  const id = knowledgeBaseArticleId;
  const userActions = useUserActions();
  const location = useLocation();
  const { title, author, content } = location.state;

  useEffect(() => {
    userActions.getArticleById(id).then(() => userActions.resetArticle);
  }, []);

  return (
    <>
      <h1>Articles</h1>
      <p>{title}</p>
      <p>{author}</p>
      <p>{content}</p>
    </>
  );
}

export { View };