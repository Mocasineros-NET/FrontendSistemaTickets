import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRecoilValue } from 'recoil';

import { articleAtom } from "../_state";
import { useUserActions, useAlertActions } from '../_actions';

export { AddEdit };

function AddEdit({ history, match }) {
  const { id } = match.params;
  const mode = { add: !id, edit: !!id };
  const userActions = useUserActions();
  const alertActions = useAlertActions();
  const article = useRecoilValue(articleAtom);

  // form validation rules
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required'),
    content: Yup.string()
      .required('Content is required'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    // fetch user details into recoil state in edit mode
    userActions.getAllTags()
    if (mode.edit) {
      userActions.getArticleById(id).then(userActions.getAllTags()).then(
        userActions.resetTags
      );
    }

    return userActions.resetTicket && userActions.resetTags;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set default form values after user set in recoil state (in edit mode)
    if (mode.edit && article) {
      reset(article);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article])

  function onSubmit(data) {
    return mode.add
      ? createArticle(data)
      : updateArticle(article.knowledgeBaseArticleId, data);
  }

  function createArticle(data) {
    data.idLocal = localStorage.getItem("idlocal");
    if (data.tags) {
      return userActions.registerArticle(data).then((response) => {
        const dataTags = {
          name: data.tags,
          knowledgeBaseArticleId: response.knowledgeBaseArticleId
        }
        userActions.registerTags(dataTags).then(() => {
          history.push('/api/knowledgeBaseArticle');
          alertActions.success('Article added');
        })
      })
    }
    return userActions.registerArticle(data)
      .then(() => {
        history.push('/api/knowledgeBaseArticle');
        alertActions.success('Article added');
      });
  }

  function updateArticle(id, data) {
    return userActions.updateArticle(id, data)
      .then(() => {
        history.push('/api/knowledgeBaseArticle');
        alertActions.success('Article updated');
      });
  }

  const loading = mode.edit && !article;
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="font-bold text-2xl m-auto">{mode.add ? 'Add Article' : 'Edit Article'}</h1>
          {!loading &&
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input name="title" type="text" {...register('title')} placeholder="Type here" className={`input bg-white input-bordered w-full max-w-xs ${errors.title ? 'is-invalid' : ''}`}/>
              <div className="invalid-feedback">{errors.title?.message}</div>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Content</span>
              </label>
              <textarea name="content" {...register('content')} className={`textarea textarea-bordered bg-white w-full max-w-xs ${errors.content ? 'is-invalid' : ''}`} placeholder="Your content..."/>
              <div className="invalid-feedback">{errors.content?.message}</div>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Tag (optional)</span>
              </label>
              <input name="tags" type="text" {...register('tags')} placeholder="Type here" className={`input bg-white input-bordered w-full max-w-xs ${errors.tags ? 'is-invalid' : ''}`}/>
              <div className="invalid-feedback">{errors.tags?.message}</div>
            </div>
            <div className="form-group mt-6">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"/>}
                Save
              </button>
              <Link to="/articles" className="btn btn-link">Cancel</Link>
            </div>
          </form>
          }
        </div>
      </div>
      {loading &&
      <div className="text-center p-3">
        <span className="spinner-border spinner-border-lg align-center"/>
      </div>
      }
    </div>
  );
}
