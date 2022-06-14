import React from 'react';
import { useEffect } from "react";
import {useRecoilValue} from "recoil";

import { ticketAtom } from "../_state";
import { useUserActions} from "../_actions";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function View({ history, match }) {
  const { id } = match.params;
  const userActions = useUserActions();
  const ticket = useRecoilValue(ticketAtom);
  const validationSchema = Yup.object().shape({
    text: Yup.string()
      .required("Comment box can't be empty")
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { isSubmitting } = formState;

  useEffect(() => {
    userActions.getTicketById(id).then(() => userActions.resetTicket);
  }, []);

  function onSubmit(id, data) {
    return createComment(id, data);
  }

  function createComment(data) {
    data.ticketId = id;
    return userActions.registerComment(data).then(() => {
      history.go(0);
    });
  }

  function removeComment(id) {
    return userActions.deleteComment(id).then(() => {
      history.go(0);
    });
  }

  const loading = !ticket;
  return (
    <>
      {!loading &&
        <>
          <h1 className="font-black text-2xl mb-3">{ticket.title}</h1>
          <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
            <span className="text-slate-500">Status</span>
            <p className="font-bold">{ticket.isClosed ? "Abierto" : 'Cerrado'}</p>
          </div>
          <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
            <span className="text-slate-500">Created by</span>
            <p className="font-bold">
              <div className="avatar placeholder mr-1">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-5">
                  <span className="text-xs">A</span>
                </div>
              </div>
              {ticket.user.firstName+' '+ticket.user.lastName}
            </p>
          </div>
          <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
            <span className="text-slate-500">Assigne</span>
            <p className="font-bold">{ticket.engineer && (
              <>
                <div className="avatar placeholder mr-1">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-5">
                    <span className="text-xs">A</span>
                  </div>
                </div>
                {ticket.engineer.firstName+' '+ticket.engineer.lastName}
              </>
            )}{!ticket.engineer && 'None'}</p>
          </div>
          <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
            <span className="text-slate-500">Date</span>
            <p className="font-bold">{ticket.createdAt.substr(0, 10)}</p>
          </div>
          <hr className="my-3"/>
          <p>{ticket.description}</p>
          <hr className="my-3"/>
          {ticket.comments.map((x) => {
            return (
              <div className="border-2 border-black" key={x.commentId}>
                <span>{x.user.username}</span>
                <p>{x.text}</p>
                <button className="btn" onClick={() => removeComment(x.commentId)} >Delete</button>
              </div>
            )
          })}
          <form onSubmit={handleSubmit(onSubmit)}>
            <input className="border border-2" name="text" type="text" {...register ('text')} />
            <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
              Save
            </button>
            <Link to="/tickets" className="btn btn-link">Cancel</Link>
          </form>
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