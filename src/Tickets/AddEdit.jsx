import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRecoilValue } from 'recoil';

import { ticketAtom } from "../_state";
import { useUserActions, useAlertActions } from "../_actions";

export { AddEdit };

function AddEdit({ history, match }) {
  const { id } = match.params;
  const mode = { add: !id, edit: !!id };
  const userActions = useUserActions();
  const alertActions = useAlertActions();
  const ticket = useRecoilValue(ticketAtom);

  // form validation rules
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required'),
    description: Yup.string()
      .required('Description is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    // fetch user details into recoil state in edit mode
    if (mode.edit) {
      userActions.getTicketById(id);
    }

    return userActions.resetTicket;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set default form values after user set in recoil state (in edit mode)
    if (mode.edit && ticket) {
      reset(ticket);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket])

  function onSubmit(data) {
    return mode.add
      ? createTicket(data)
      : updateTicket(ticket.id, data);
  }

  function createTicket(data) {
    return userActions.registerTicket(data)
      .then(() => {
        history.push('/api/Tickets');
        alertActions.success('Ticket added');
      });
  }

  function updateTicket(id, data) {
    return userActions.updateTicket(id, data)
      .then(() => {
        history.push('/api/Tickets');
        alertActions.success('Ticket updated');
      });
  }

  const loading = mode.edit && !ticket;
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="font-bold text-2xl m-auto">{mode.add ? 'Add Ticket' : 'Edit Ticket'}</h1>
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
                <span className="label-text">Description</span>
              </label>
              <input name="description" type="text" {...register('description')} placeholder="Type here" className={`input bg-white input-bordered w-full max-w-xs ${errors.description ? 'is-invalid' : ''}`}/>
              <div className="invalid-feedback">{errors.description?.message}</div>
            </div>
            <div className="form-group mt-6">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"/>}
                Save
              </button>
              <Link to="/tickets" className="btn btn-link">Cancel</Link>
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
