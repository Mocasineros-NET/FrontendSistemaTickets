import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useUserActions, useAlertActions } from "../_actions";
import { Logo } from '../_components/Logo';

export { Register };

function Register({ history }) {
  const userActions = useUserActions();
  const alertActions = useAlertActions();

  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last Name is required'),
    username: Yup.string()
      .required('Username is required'),
    email: Yup.string()
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit(data) {
    return userActions.register(data)
      .then(() => {
        history.push('/Account/login');
        alertActions.success('Registration successful');
      })
  }

  return (
    <div className="flex items-center justify-center text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="card w-[20%] h-[680px]">
        <div className="card-body">
          <Logo />
          <h1 className="card-title text-5xl mt-2 mb-2">Sign up</h1>
          <label className="label m-0 p-0">
            <span className="label-text text-white">First Name</span>
          </label>
          <input name="firstName" type="text" {...register('firstName')} className={`form-control text-black ${errors.firstName ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
          <label className="label m-0 p-0">
            <span className="label-text text-white">Last Name</span>
          </label>
          <input name="lastName" type="text" {...register('lastName')} className={`form-control text-black ${errors.lastName ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.lastName?.message}</div>
          <label className="label m-0 p-0">
            <span className="label-text text-white">Email</span>
          </label>
          <input name="username" type="text" {...register('email')} className={`form-control text-black ${errors.email ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.email?.message}</div>
          <label className="label m-0 p-0">
            <span className="label-text text-white">Username</span>
          </label>
          <input name="username" type="text" {...register('username')} className={`form-control text-black ${errors.username ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.username?.message}</div>
          <label className="label m-0 p-0">
            <span className="label-text text-white">Password</span>
          </label>
          <input name="password" type="password" {...register('password')} className={`form-control text-black ${errors.password ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.password?.message}</div>
          <div className="card-actions justify-start mt-3">
            <button disabled={isSubmitting} className="btn text-white bg-slate-900 hover:bg-stone-900">
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"/>}
              Register
            </button>
            <Link to="login" className="btn text-white bg-gray-500 hover:bg-stone-600 border-none">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
