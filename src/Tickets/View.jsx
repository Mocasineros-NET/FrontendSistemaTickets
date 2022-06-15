import React from 'react';
import { useEffect } from "react";
import {useRecoilValue} from "recoil";

import { ticketAtom } from "../_state";
import { useUserActions} from "../_actions";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

function View({ history, match }) {
  const { id } = match.params;
  const role = JSON.parse(localStorage.getItem('user')).role;
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
    if (role === 3) {
      userActions.getTicketByIdForUser(id).then(() => userActions.resetTicket);
    } else if (role === 2) {
      userActions.getTicketByIdForEngineer(id).then(() => userActions.resetTicket);
    } else {
      userActions.getTicketById(id).then(() => userActions.resetTicket);
    }
  }, []);

  function onClickOpenCloseTicket(isClosed, ticketId) {
    if (isClosed === false) {
      return userActions.closeTicket(ticketId).then(() => {
        history.go(0);
      });
    } else {
      return userActions.openTicket(ticketId).then(() => {
        history.go(0);
      });
    }
  }

  function onClickSetPriority(ticketId, priority) {
    const data = {
      priority: priority
    }
    return userActions.setPriority(ticketId, data).then(() => {
      history.go(0);
    });
  }

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
      <div className="card w-[100%] bg-base-100 shadow-xl">
        <div className="card-body">
          {!loading &&
          <>
            <div className="grid grid-cols-2">
              <h1 className="font-black text-2xl mb-3 justify-self-start">🎟{ticket.title} {ticket.isClosed === true && <span className="text-rose-700">(CLOSED)</span>}</h1>
              {(ticket.isClosed === false && role !== 3) && <button onClick={() => onClickOpenCloseTicket(ticket.isClosed, ticket.id)} className="btn justify-self-end">Close ticket</button>}{(ticket.isClosed === true && role !== 3) && <button onClick={() => onClickOpenCloseTicket(ticket.isClosed, ticket.id)} className="btn justify-self-end">Open ticket</button>}
            </div>
            <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
              <span className="text-slate-500">Status</span>
              <p className="font-bold">{ticket.isClosed ? "Closed" : 'Open'}</p>
            </div>
            <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
              <span className="text-slate-500">Created by</span>
              <span className="font-bold">
              <div className="avatar placeholder mr-1">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-5">
                  <span className="text-xs">A</span>
                </div>
              </div>
                {ticket.user.firstName+' '+ticket.user.lastName}
            </span>
            </div>
            <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
              <span className="text-slate-500">Assigne</span>
              <span className="font-bold">{ticket.engineer && (
                <>
                  <div className="avatar placeholder mr-1">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-5">
                      <span className="text-xs">A</span>
                    </div>
                  </div>
                  {ticket.engineer.firstName+' '+ticket.engineer.lastName}
                </>
              )}{!ticket.engineer && 'None'}</span>
            </div>
            <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
              <span className="text-slate-500">Date</span>
              <p className="font-bold">{ticket.createdAt.substr(0, 10)}</p>
            </div>
            <div className="grid grid-cols-[200px_minmax(900px,_1fr)]">
              <span className="text-slate-500">Priority</span>
              <span className="font-bold">
              <div className="dropdown dropdown-right">
                <label tabIndex="0" className={`${role !== 3 ? 'cursor-pointer' : ''} ${ticket.priority === 4 ? 'text-amber-400' : ''}${ticket.priority === 3 ? 'text-amber-500' : ''}${ticket.priority === 2 ? 'text-slate-300' : ''}${ticket.priority === 1 ? 'text-rose-500' : ''}${ticket.priority === 0 ? 'text-amber-700' : ''}`}>{ticket.priority === 4 && "Very low"}{ticket.priority === 3 && "Low"}{ticket.priority === 2 && "Moderate"}{ticket.priority === 1 && "High"}{ticket.priority === 0 && "Urgent"}</label>
                {role !== 3 && <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-white">
                  <li><a onClick={() => onClickSetPriority(ticket.id, 4)} className="text-amber-400">Very low</a></li>
                  <li><a onClick={() => onClickSetPriority(ticket.id, 3)} className="text-amber-500">Low</a></li>
                  <li><a onClick={() => onClickSetPriority(ticket.id, 2)} className="text-slate-300">Moderate</a></li>
                  <li><a onClick={() => onClickSetPriority(ticket.id, 1)} className="text-rose-500">High</a></li>
                  <li><a onClick={() => onClickSetPriority(ticket.id, 0)} className="text-rose-700">Urgent</a></li>
                </ul>}
              </div>
            </span>
            </div>
            <hr className="my-3 border-black"/>
            <p>{ticket.description}</p>
            <hr className="my-3 border-black"/>
            {ticket.comments && <h2 className="font-black text-xl mb-3">Comments</h2>}
            {ticket.comments.map((x) => {
              return (
                <div className="alert bg-primary-transparent shadow-lg w-[70%] p-5 text-white m-auto">
                  <div>
                    <div className="avatar">
                      <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src="https://api.lorem.space/image/face?hash=3174" alt="profile picture"/>
                      </div>
                    </div>
                    <div className="flex flex-col ml-4">
                      <span className="font-bold text-black">{x.user.firstName} {x.user.lastName}</span>
                      <p className="text-black">{x.text}</p>
                      <button className="btn btn-secondary mt-2 btn-sm w-24 self-start" onClick={() => removeComment(x.commentId)} >Delete</button>
                    </div>
                  </div>
                </div>
              )
            })}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-96 mt-5 m-auto">
              {ticket.isClosed === false && <>
                <textarea name="text" {...register ('text')} className="textarea textarea-primary" placeholder="Type here"/>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-3 mr-2 w-40 self-center">
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"/>}
                  Send comment
                </button>
              </>}
            </form>
          </>
          }
          {loading &&
          <div className="text-center p-3">
            <span className="spinner-border spinner-border-lg align-center"/>
          </div>
          }
        </div>
      </div>
  );
}

export { View };