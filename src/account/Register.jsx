import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useUserActions, useAlertActions } from '_actions';
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
        history.push('/account/login');
        alertActions.success('Registration successful');
      })
  }

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="card w-[20%] h-[610px]">
        <div className="card-body">
          <Logo />
          <h1 className="card-title text-5xl mt-2 mb-2">Sign up</h1>
          <label className="label m-0 p-0">
            <span className="label-text text-slate-500 font-bold">First Name</span>
          </label>
          <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
          <label className="label m-0 p-0">
            <span className="label-text text-slate-500 font-bold">Last Name</span>
          </label>
          <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.lastName?.message}</div>
          <label className="label m-0 p-0">
            <span className="label-text text-slate-500 font-bold">Username</span>
          </label>
          <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.username?.message}</div>
          <label className="label m-0 p-0">
            <span className="label-text text-slate-500 font-bold">Password</span>
          </label>
          <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.password?.message}</div>
          <div className="card-actions justify-start mt-3">
            <button disabled={isSubmitting} className="btn text-white bg-slate-900 hover:bg-stone-900">
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
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
