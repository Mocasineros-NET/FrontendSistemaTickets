import React from 'react';
import { useEffect, useState } from "react";
import {useRecoilValue} from "recoil";

import { ticketAtom } from "../_state";
import { useUserActions} from "../_actions";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";

function View({ history, match }) {
  const { id } = match.params;
  const userActions = useUserActions();
  const ticket = useRecoilValue(ticketAtom);
  const location = useLocation();
  const { title, description, date, comments } = location.state;
  console.log(location.state);

  const validationSchema = Yup.object().shape({
    text: Yup.string()
      .required("Comment box can't be empty")
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    userActions.getTicketById(id).then(() => userActions.resetTicket);
  }, []);

  function onSubmit(data) {
    return createComment(ticket.id, data);
  }

  function createComment(id, data) {
    data.ticketId = id;
    return userActions.registerComment(data)
  }

  return (
    <>
      <h1>Tickets</h1>
      <p>{title}</p>
      <p>{description}</p>
      <p>{date}</p>
      {comments.map((x) => {
        return (
          <div className="border-2 border-black">
            <span>{x.user.username}</span>
            <p>{x.text}</p>
            <button className="btn" onClick={() => userActions.deleteComment(x.commentId)} >Eliminar</button>
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
  );
}

export { View };