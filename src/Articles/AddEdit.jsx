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
    if (mode.edit) {
      userActions.getArticleById(id);
    }

    return userActions.resetTicket;

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
    <>
      <h1>{mode.add ? 'Add Article' : 'Edit Article'}</h1>
      {!loading &&
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col">
              <label>Title</label>
              <input name="title" type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.title?.message}</div>
            </div>
            <div className="form-group col">
              <label>Content</label>
              <input name="content" type="text" {...register('content')} className={`form-control ${errors.content ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.content?.message}</div>
            </div>
            <div className="form-group col">
              <label>Tags</label>
              <div className="flex">
                <select className="select w-full max-w-xs text-black bg-white border-black">
                  <option disabled selected>Pick your favorite Simpson</option>
                  <option value="1">Homer</option>
                  <option value="2">Marge</option>
                  <option value="3">Bart</option>
                  <option value="4">Lisa</option>
                  <option value="5">Maggie</option>
                </select>
                <label htmlFor="my-modal" className="btn modal-button text-white">+</label>
              </div>
              <input type="checkbox" id="my-modal" className="modal-toggle" />
              <div className="modal">
                <div className="modal-box bg-white">
                  <h3 className="font-bold text-lg">Add Tags</h3>
                  <p className="py-4">You've been selected for a change to get a...</p>
                  <div className="modal-action">
                    <label htmlFor="my-modal" className="btn">Yay!</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
              Save
            </button>
            <Link to="/articles" className="btn btn-link">Cancel</Link>
          </div>
        </form>
      }
      {loading &&
        <div className="text-center p-3">
          <span className="spinner-border spinner-border-lg align-center"></span>
        </div>
      }
    </>
  );
}
